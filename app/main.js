'use strict';

const express     = require('express')
const app         = express()
const server      = require('http').createServer(app)
const io          = require('socket.io')(server)
const Client      = require('castv2').Client
const mdns        = require('mdns')
const mongoose    = require('mongoose')
mongoose.Promise  = require('bluebird')
const bodyParser  = require('body-parser')
const path        = require('path')
const fs          = require('fs')

const Chromecast  = require('./models/Chromecast')
const Channel     = require('./models/Channel')

const port = 3944
var takeover = null

/* Configuration */

var config
try {
  config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '.config')))
} catch (e) {
  console.log(`No config file found in ${path.resolve(__dirname, '..')}`)
  console.log('Please run')
  console.log('   npm run config')
  console.log('before attempting to launch Multicast')
  process.exit()
}

/* Establish connection with MongoDB */

mongoose.connect(
  `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoHost}:${config.mongoPort}/multicast?authSource=${config.mongoAuthSource}`, {
  useMongoClient: true
})

/* Establish connection with Chromecast devices on local network */

var devices = [],
findDevices = () => {
  
  /* Look for mDNS Cast devices on local network */
  var browser = mdns.createBrowser(mdns.tcp('googlecast'))

  /* Only scan IPv4 addresses */
  mdns.Browser.defaultResolverSequence[1] = 'DNSServiceGetAddrInfo' in mdns.dns_sd ?
    mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [4] })

  browser.on('serviceUp', service => {
    // service.name: Chromecast-hexadecimalid
    var id = service.name.split('-').pop(),
      i = devices.findIndex(d => d.deviceId == id)

    /* If device is registered, append local statistics */
    if (i > -1) {
      devices[i].name = service.txtRecord.fn
      devices[i].address = service.addresses[0]
      devices[i].port = service.port
      if (devices[i].status == 'offline') {
        devices[i].status = 'waiting'
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
launchHub = (host) => {

  if (host) {

    var d = devices.find(d => d.address == host)

    d.connectionFailCount = 0
    if (d.status == 'offline' || d.status == 'waiting') {
      
      const client = new Client()
      client.connect(host, () => {

        // reset number of failed connection attempts
        d.connectionFailCount = 0

        // create various namespace handlers
        d.connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON')
        d.heartbeat = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON')
        d.receiver = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON')

        // establish virtual connection to the receiver
        d.connection.send({ type: 'CONNECT' })

        // start heartbeating
        d.missedHeartbeats = 0
        d.pulse = setInterval(() => {
          d.missedHeartbeats++
          if (d.missedHeartbeats > 6) { // receiver has been offline for more than 30 seconds
            d.status = 'offline'        // mark receiver as offline
            clearInterval(d.pulse)  // stop checking for pulse :(
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
          if (data.type = 'RECEIVER_STATUS') {
            // data.status contains relevant information about current app, volume, etc
            if (data.status && data.status.applications) {
              var apps = data.status.applications

              /* Backdrop means that our hub applications has stopped running, so we need to restart it */
              if (apps.find(a => a.displayName == 'Backdrop')) {
                console.log('relaunching hub...')
                d.receiver.send({ type: 'LAUNCH', appId: config.appId, requestId: 1 })
              }

            }
          }
        })

      })
      client.on('error', () => {
        d.connectionFailCount++
        if (d.connectionFailCount > 6) { // receiver hasn't responded after 60 seconds
          clearTimeout(d.connectionFail)
        } else d.connectionFail = setTimeout(() => launchHub(host), 10 * 1000)
      })      

    }

  }

}

/* Establish socket.io service */

var clients = []
io.on('connection', client => {
  clients.push(client)
  client.on('disconnect', () => {
    var i = clients.indexOf(client)
    clients.splice(i, 1)
  })
})

/* Express Setup */

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static(path.resolve(__dirname, '..', 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

/* Home Page */

app.get('/', (req, res) => {
  res.render('index', { render: 'home', takeover: takeover })  
})

/* Nyan!! */

app.get('/nyan', (req, res) => {
  res.render('nyan', {})
})

/* Landing Page */

app.get('/landing', (req, res) => {

  var ip = stripIPv6(req.connection.remoteAddress), // Get IPv4 address of device
      d = devices.find(d => d.address == ip)        // Find local info for device
  if (d) res.redirect(`/device/${d.deviceId}`)      // Redirect to device display
  else res.render('setup-chromecast', { device: {   // If not recognized, display information
    address: ip,
    deviceId: 'n/a',
    name: 'Unrecognized Device'
  }, registered: false, setupUrl: `${req.protocol}://${req.hostname}:${port}/` })
})

/* Devices */

app.get('/devices', (req, res) => {
  res.render('index', { render: 'devices', devices: devices })  
})

app.get('/device/new', (req, res) => {
  Channel.find().sort('name').exec((err, channels) => {
    if (err) console.log(err)
    res.render('index', { render: 'device', devices: devices.filter(d => d.unregistered), channels: channels })
  })
})

app.post('/device/new', (req, res) => {
  var c = new Chromecast(req.body)
  c.save((err, device) => {
    if (err) console.log(err)

    /* Mark local info as registered */
    var i = devices.findIndex(d => d.deviceId == req.body.deviceId)
    delete devices[i].unregistered

    /* Update local info with any new details */
    devices[i] = Object.assign(devices[i], req.body)

    /* Launch hub on newly registered device */
    var c = clients.find(c => stripIPv6(c.handshake.address) == devices[i].address)
    if (c) c.emit('register', devices[i].deviceId) // emit 'register' to have setup page redirected
    else launchHub(devices[i].address)             // establish connection if client hasn't already connected

    res.send(device.deviceId)
  })
})

app.get('/device/:device_id', (req, res) => {
  Chromecast.findOne({ deviceId: req.params.device_id }).populate('channel').exec((err, device) => {
    if (err) console.log(err)
    if (device && device.channel) {
      if (takeover) res.render(`layouts/${takeover.layout}`, { deviceId: req.params.device_id, channel: takeover })
      else {

        /* device registered and channel set
          display device page */
        res.render(`layouts/${device.channel.layout}`, { deviceId: req.params.device_id, channel: device.channel })

      }
    } else {
      var localDevice = devices.find(d => d.deviceId == req.params.device_id)
      if (device) {
        if (takeover) res.render(`layouts/${takeover.layout}`, { deviceId: req.params.device_id, channel: takeover })
        else {

          /* device registered but no channel set
            display setup page */
          res.render('setup-chromecast', {
            device: Object.assign(localDevice, device),
            registered: true,
            setupUrl: `${req.protocol}://${req.hostname}:${port}/`
          })

        }
      } else {

        /* device is not registered
           display setup page */
        res.render('setup-chromecast', {
          device: Object.assign(localDevice, device),
          registered: false,
          setupUrl: `${req.protocol}://${req.hostname}:${port}/`
        })

      }
    }
  })
})

app.get('/device/:device_id/connect', (req, res) => {
  var d = devices.find(d => d.deviceId == req.params.device_id)
  if (d.status == 'offline' || d.status == 'waiting') launchHub(d.address)            // launch hub if not already open
  else clients.find(c => stripIPv6(c.handshake.address) == d.address).emit('refresh') // hard reload page if already open
  res.sendStatus(200)
})

app.post('/device/:device_id/edit', (req, res) => {
  Chromecast.update({ deviceId: req.params.device_id }, req.body, (err, numAffected, response) => {
    if (err) console.log(err)
    var i = devices.findIndex(d => d.deviceId == req.params.device_id)
    devices[i].location = req.body.location // update local info with location
    if (req.body.channel) {
      Channel.findOne({ _id: req.body.channel }).exec((err, channel) => {
        clients.find(c => stripIPv6(c.handshake.address) == devices[i].address).emit('change_channel', channel)
        devices[i].channel = channel // update local info with new channel info for any applicable devices
        res.send(req.params.device_id)
      })
    } else {
      clients.find(c => stripIPv6(c.handshake.address) == devices[i].address).emit('change_channel', null)      
      res.send(req.params.device_id)
    }
  })
})

app.delete('/device/:device_id/edit', (req, res) => {
  Chromecast.remove({ deviceId: req.params.device_id }, () => {
    /* Mark local info for device as unregistered */
    var i = devices.findIndex(d => d.deviceId == req.params.device_id)
    devices[i].unregistered = true
    delete devices[i].channel
    delete devices[i].location
    res.sendStatus(200)
  })
})

app.get('/device/:device_id/edit', (req, res) => {
  Chromecast.findOne({ deviceId: req.params.device_id }).populate('channel').exec((err, device) => {
    if (err) console.log(err)
    Channel.find().sort('name').exec((err, channels) => {
      if (err) console.log(err)
      if (device) {
        var localDevice = devices.find(d => d.deviceId == req.params.device_id)
        res.render('index', { render: 'device', device: Object.assign(localDevice, device), channels: channels })
      } else res.render('index', {})
    })
  })
})

/* Channels */

app.get('/channels', (req, res) => {
  Channel.find().sort('name').exec((err, channels) => {
    res.render('index', { render: 'channels', channels: channels })
  })
})

app.get('/channel/new', (req, res) => {
  res.render('index', { render: 'channel' })
})

app.post('/channel/new', (req, res) => {
  if (req.body.URLs) req.body.URLs = req.body.URLs.filter(u => u.trim() != '')
  var c = new Channel(req.body)
  c.save((err, channel) => {
    if (err) console.log(err)
    res.send(channel._id)
  })
})

app.get('/channel/:channel_id', (req, res) => {
  Channel.findOne({ _id: req.params.channel_id }).exec((err, channel) => {
    if (err) console.log(err)
    if (channel) res.render(`layouts/${channel.layout}`, { channel: channel })
    else res.render('layouts/empty', {})
  })
})

app.post('/channel/:channel_id/edit', (req, res) => {
  if (req.body.URLs) req.body.URLs = req.body.URLs.filter(u => u.trim() != '')
  for (var i in devices) {
    var d = devices[i]

    /* update channel info on local info for any devices displaying this channel */
    if (d.channel && d.channel._id.toString() == req.params.channel_id.toString()) {
      Object.assign(devices[i].channel, req.body)
    }

  }
  Channel.update({ _id: req.params.channel_id }, req.body, (err, numAffected, response) => {
    if (err) console.log(err)
    res.send(req.params.channel_id)
  })
})

app.delete('/channel/:channel_id/edit', (req, res) => {
  Channel.remove({ _id: req.params.channel_id }, () => {
    for (var i in devices) {
      var d = devices[i]
      if (d.channel && d.channel._id.toString() == req.params.channel_id.toString()) {

        /* remove channel listing from local info of relevant devices */
        delete devices[i].channel

        /* send devices on this channel back to setup page */
        var c = clients.find(c => stripIPv6(c.handshake.address) == devices[i].address)
        if (c) c.emit('change_channel', null)

      }
    }

    /* remove channel listing from Mongo */
    Chromecast.update({ channel: new mongoose.Types.ObjectId(req.params.channel_id) }, { $unset: { channel: 1 } }, (err, numAffected, result) => {
      res.sendStatus(200)
    })

  })
})

app.get('/channel/:channel_id/edit', (req, res) => {
  Channel.findOne({ _id: req.params.channel_id }).exec((err, channel) => {
    if (err) console.log(err)
    if (channel) res.render('index', { render: 'channel', channel: channel })
    else res.render('index', {})
  })
})

/* Push Alerts & Takeovers */

app.get('/new/push', (req, res) => {
  res.render('index', { render: 'push' })
})

app.post('/new/push', (req, res) => {
  clients.forEach(c => {
    c.emit('push', {
      message: req.body.message,
      style: req.body.style,
      duration: req.body.duration
    })
  })
  res.sendStatus(200)
})

app.get('/new/takeover', (req, res) => {
  Channel.find().sort('name').exec((err, channels) => {
    res.render('index', { render: 'takeover', channels: channels })
  })
})

app.post('/new/takeover', (req, res) => {
  Channel.findOne({ _id: new mongoose.Types.ObjectId(req.body.channel_id) }).exec((err, channel) => {
    if (err) console.log(err)
    takeover = channel
    clients.forEach(c => {
      c.emit('change_channel', channel)
    })
    res.sendStatus(200)
  })
})

app.post('/takeover/end', (req, res) => {
  takeover = null
  clients.forEach(c => {
    c.emit('refresh')
  })
  res.sendStatus(200)
})

/* Server */

server.listen(port, () => {
  console.log('MultiCast is live!')
  console.log(`listening at port ${port}...`)

  /* load saved devices */
  Chromecast.find().populate('channel').exec((err, _devices) => {
    for (var i in _devices) {
      var d = _devices[i].toObject()
      d.status = 'offline'
      devices.push(d)
    }

    /* poll for active devices */
    findDevices()

    /* start interval to continue polling for device status */
    setInterval(() => {
      findDevices()
    }, 30 * 1000)
  })
})

/* Utility */

var stripIPv6 = ip => ip.replace(/^.*:/, '')
