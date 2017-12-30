'use strict'

const mdns = require('mdns')

const Chromecast = require('../models/Chromecast')
const Channel = require('../models/Channel')

const sockets = require('./sockets')
const connection = require('./connection')

let devices = []

const func = {
  init: () => {
    Chromecast.find()
      .populate('channel')
      .exec((err, chromecasts) => {
        console.log(chromecasts)
        devices = chromecasts
        devices.forEach(d => (d.status = 'offline'))
        findDevices()
        /* start interval to continue polling for device status */
        setInterval(() => {
          func.refresh()
        }, 30 * 1000)
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

    Chromecast.update({ channel: id }, { $unset: { channel: 1 } }, err => {
      if (err) console.log(err)
      callback()
    })
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
      let _id = service.name.split('-'),
        id = _id.pop()

      // fix for groups with IDs that resemble Google-Cast-Group-{deviceId}-1
      while (_id.length > 0 && id.length < 3) id = _id.pop()

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
          port: service.port,
          rotation: 'rot0'
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
    if (host) connection.establish(func.withHost(host), () => launchHub(host))
  }

module.exports = func
