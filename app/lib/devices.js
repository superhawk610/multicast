'use strict'

const Client = require('castv2').Client
const mdns = require('mdns')

const Chromecast = require('../models/Chromecast')
const Channel = require('../models/Channel')

const sockets = require('./sockets')
const config = require('./config')

let devices = []

const func = {
  init: () => {
    Chromecast.find().populate('channel').exec((err, chromecasts) => {
      devices = chromecasts
      devices.forEach(d => d.status = 'offline')
      findDevices()
    })
  },
  refresh: () => findDevices(),
  list: () => devices,
  isRegistered: id => devices.findIndex(d => d.deviceId == id) > -1,
  isOffline: id => func.withId(id).status == 'offline',
  isOnline: id => func.withId(id).status == 'online',
  setStatus: (id, status) => (func.withId(id).status = status),
  withId: id => devices.find(d => d.deviceId == id),
  withHost: host => devices.find(d => d.address == host),
  update: (id, opts) => {
    let i = devices.findIndex(d => d.deviceId == id)
    Object.assign(devices[i], opts)
  },
  register: (id, opts) => {
    let d = func.withId(id)

    delete d.unregistered // mark local info as registered
    func.update(id, opts) // update local info with any new details

    /* Launch hub on newly registered device */
    let c = sockets.withHost(d.address)
    if (c)
      c.emit('register', d.deviceId) // emit 'register' to have setup page redirected
    else launchHub(d.address) // establish connection if client hasn't already connected
  },
  reconnect: host => launchHub(host),
  updateChannel: (channel, callback) => {
    for (let i in devices) {
      let d = devices[i]
      if (d.channel && d.channel._id == channel._id) {
        Object.assign(d.channel, channel)
        let c = sockets.withHost(d.address)
        if (c) c.emit('refresh')
      }
    }
    callback()
  },
  removeChannel: (id, callback) => {
    for (let i in devices) {
      let d = devices[i]
      if (d.channel && d.channel._id == id) delete d.channel
      let c = sockets.withHost(d.address)
      if (c) c.emit('change_channel', null)
    }

    Chromecast.update(
      { channel: id },
      { $unset: { channel: 1 } },
      err => {
        if (err) console.log(err)
        callback()
      }
    )
  },
  refreshChannelPath: _path => {
    for (let i in devices) {
      let d = devices[i]
      if (d.channel && d.channel.URLs[0].match(new RegExp(`/${_path}`))) {
        let c = sockets.withHost(d.address)
        if (c) c.emit('refresh')
      }
    }
  },
  refreshAll: callback => {
    for (let i in devices) {
      let d = devices[i],
        c = sockets.withHost(d.address)
      if (c) c.emit('refresh')
    }
    callback()
  }
}

const findDevices = () => {
    /* Look for mDNS Cast devices on local network */
    let browser = mdns.createBrowser(mdns.tcp('googlecast'))

    /* Only scan IPv4 addresses */
    mdns.Browser.defaultResolverSequence[1] =
      'DNSServiceGetAddrInfo' in mdns.dns_sd
        ? mdns.rst.DNSServiceGetAddrInfo()
        : mdns.rst.getaddrinfo({ families: [4] })

    browser.on('serviceUp', service => {
      // service.name: Chromecast-hexadecimalid
      let id = service.name.split('-').pop()

      /* If device is registered, append local statistics */
      if (func.isRegistered(id)) {
        func.update(id, {
          name: service.txtRecord.fn,
          address: service.addresses[0],
          port: service.port
        })
        if (func.isOffline(id)) {
          func.setStatus(id, 'waiting')
          launchHub(service.addresses[0])
        }

        /* Otherwise, add info for unregistered device */
      } else {
        devices.push({
          unregistered: true,
          deviceId: id,
          name: service.txtRecord.fn,
          address: service.addresses[0],
          port: service.port
        })
      }
    })

    /* Begin searching */
    browser.start()

    /* Stop searching after 15 seconds */
    setTimeout(() => browser.stop(), 15 * 1000)
  },
  /* Establish connection with Chromecast */
  launchHub = host => {
    if (host) {
      let d = func.withHost(host)

      d.connectionFailCount = 0
      if (d.status == 'offline' || d.status == 'waiting') {
        const client = new Client()
        client.connect(host, () => {
          // reset number of failed connection attempts
          d.connectionFailCount = 0

          // create various namespace handlers
          d.connection = client.createChannel(
            'sender-0',
            'receiver-0',
            'urn:x-cast:com.google.cast.tp.connection',
            'JSON'
          )
          d.heartbeat = client.createChannel(
            'sender-0',
            'receiver-0',
            'urn:x-cast:com.google.cast.tp.heartbeat',
            'JSON'
          )
          d.receiver = client.createChannel(
            'sender-0',
            'receiver-0',
            'urn:x-cast:com.google.cast.receiver',
            'JSON'
          )

          // establish virtual connection to the receiver
          d.connection.send({ type: 'CONNECT' })

          // start heartbeating
          d.missedHeartbeats = 0
          d.pulse = setInterval(() => {
            d.missedHeartbeats++
            if (d.missedHeartbeats > 6) {
              // receiver has been offline for more than 30 seconds
              d.status = 'offline' // mark receiver as offline
              clearInterval(d.pulse) // stop checking for pulse :(
            } else d.heartbeat.send({ type: 'PING' })
          }, 5 * 1000)
          d.heartbeat.on('message', (data, broadcast) => {
            if (data.type == 'PONG') {
              d.missedHeartbeats = 0
              d.status = 'online'
            }
          })

          // launch hub app
          d.receiver.send({ type: 'LAUNCH', appId: config.appId, requestId: 1 })

          // monitor receiver status updates to insure hub is open
          d.receiver.on('message', (data, broadcast) => {
            if (data.type != 'RECEIVER_STATUS') console.log(data.type)
            if ((data.type = 'RECEIVER_STATUS')) {
              // data.status contains relevant information about current app, volume, etc
              if (data.status && data.status.applications) {
                var apps = data.status.applications

                /* Backdrop means that our hub applications has stopped running, so we need to restart it */
                if (apps.find(a => a.displayName == 'Backdrop')) {
                  console.log('relaunching hub...')
                  d.receiver.send({
                    type: 'LAUNCH',
                    appId: config.appId,
                    requestId: 1
                  })
                }
              }
            }
          })
        })
        client.on('error', () => {
          d.connectionFailCount++
          if (d.connectionFailCount > 6) {
            // receiver hasn't responded after 60 seconds
            clearTimeout(d.connectionFail)
          } else d.connectionFail = setTimeout(() => launchHub(host), 10 * 1000)
        })
      }
    }
  }

module.exports = func
