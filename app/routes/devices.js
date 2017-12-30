'use strict'

const express = require('express')
const router = express.Router()

const Chromecast = require('../models/Chromecast')

const devices = require('../lib/devices')
const channels = require('../lib/channels')
const sockets = require('../lib/sockets')
const takeover = require('../lib/takeover')

const port = require('../lib/config').port

router.get('/', (req, res) => {
  res.render('index', { render: 'devices', devices: devices.list() })
})

router
  .route('/new')
  .get((req, res) => {
    res.render('index', {
      render: 'device',
      devices: devices.list().filter(d => d.unregistered),
      channels: channels.list()
    })
  })
  .post((req, res) => {
    let c = new Chromecast(req.body)
    c.save((err, device) => {
      if (err) console.log(err)
      devices.register(device.deviceId, req.body)
      res.send(device.deviceId)
    })
  })

router.get('/:device_id', (req, res) => {
  let d = devices.withId(req.params.device_id)
  if (d && takeover.isActive()) {
    res.render(`layouts/${takeover.channel().layout}`, {
      deviceId: req.params.device_id,
      channel: takeover.channel(),
      casting: true
    })
  } else {
    if (d) {
      if (d.channel) {
        /* device registered and channel set
        display device page */
        res.render(`layouts/${d.channel.layout}`, {
          deviceId: req.params.device_id,
          channel: d.channel,
          casting: true
        })
      } else {
        /* device registered but no channel set
        display setup page */
        res.render('setup-chromecast', {
          device: d,
          registered: true,
          setupUrl: `${req.protocol}://${req.hostname}:${port}/`
        })
      }
    } else {
      /* device is not registered
      display setup page */
      res.render('setup-chromecast', {
        device: d,
        registered: false,
        setupUrl: `${req.protocol}://${req.hostname}:${port}/`
      })
    }
  }
})

router.get('/:device_id/connect', (req, res) => {
  let d = devices.withId(req.params.device_id)
  if (!devices.isOnline(req.params.device_id)) devices.reconnect(d.address)
  else {
    // launch hub if not already open
    // hard reload page if already open
    var c = sockets.withHost(d.address)
    if (c) c.emit('refresh')
  }
  res.sendStatus(200)
})

router
  .route('/:device_id/edit')
  .get((req, res) => {
    let d = devices.withId(req.params.device_id)
    if (d) {
      res.render('index', {
        render: 'device',
        device: d,
        channels: channels.list()
      })
    } else render('index', {})
  })
  .post((req, res) => {
    Chromecast.update(
      { deviceId: req.params.device_id },
      req.body,
      err => {
        if (err) console.log(err)

        let d = devices.withId(req.params.device_id)
        d.location = req.body.location // update local info with location
        console.log('host', d.address)
        let c = sockets.withHost(d.address),
          channel = null
        if (req.body.channel) {
          channel = channels.withId(req.body.channel)
          d.channel = channel // update local info with channel
        }
        console.log('socket_client', c)
        if (c) c.emit('change_channel', channel)
        res.send(req.params.device_id)
      }
    )
  })
  .delete((req, res) => {
    Chromecast.remove({ deviceId: req.params.device_id }, () => {
      /* Mark local info for device as unregistered */
      let d = devices.withId(req.params.device_id)
      d.unregistered = true
      delete d.channel
      delete d.location
      res.sendStatus(200)
    })
  })

module.exports = router
