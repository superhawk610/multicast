'use strict'

// prettier-ignore-block
const express     = require('express')
const app         = express()
const server      = require('http').createServer(app)
const mongoose    = require('mongoose')
mongoose.Promise  = require('bluebird')
const bodyParser  = require('body-parser')
const path        = require('path')
const fs          = require('fs')

const Chromecast  = require('./models/Chromecast')

const config      = require('./lib/config')
const dbConnect   = require('./lib/dbConnect')
const stripIPv6   = require('./lib/stripIPv6')

const devices     = require('./lib/devices')
const channels    = require('./lib/channels')
const sockets     = require('./lib/sockets')
const takeover    = require('./lib/takeover')
const connection  = require('./lib/connection')
const ux          = require('./lib/ux')

const port        = config.port
const serveOnly   = process.argv.find(arg => arg == '--serve-only')
// prettier-ignore-block

/* Establish database connection */
dbConnect(config)

/* Load initial channel listing */
channels.init()

/* Establish socket.io service */
sockets.init(server)

/* Express Setup */
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, '..', 'public')))
app.locals.connection = connection
app.locals.ux = ux

/* Home Page */
app.get('/', (req, res) => {
  res.render('index', { render: 'home', takeover: takeover })
})

/* Nyan!! */
app.get('/nyan', (req, res) => {
  res.render('nyan', {})
})

/* Basic Message Channel */
app.use('/message', require('./routes/message'))

/* Landing Page */
app.get('/landing', (req, res) => {
  var ip = stripIPv6(req.connection.remoteAddress), // Get IPv4 address of device
    d = devices.withHost(ip) // Find local info for device
  if (d)
    res.redirect(`/devices/${d.deviceId}`) // Redirect to device display // Display device info
  else
    res.render('setup-chromecast', {
      device: {
        address: ip,
        deviceId: 'n/a',
        name: 'Unrecognized Device'
      },
      registered: false,
      setupUrl: `${req.protocol}://${req.hostname}:${port}/`
    })
})

/* Devices */
app.use('/devices', require('./routes/devices'))

/* Channels */
app.use('/channels', require('./routes/channels'))

/* Push Alerts */
app.use('/push', require('./routes/push'))

/* Takeover */
app.use('/takeover', require('./routes/takeover'))

/* Server */
server.listen(port, () => {
  console.log('MultiCast is live!')
  console.log(`listening at port ${port}...`)

  if (!serveOnly) {
    /* poll for active devices */
    devices.init()
  }
})
