const express = require('express')
const router = express.Router()

const channels = require('../lib/channels')

const Chromecast = require('../models/Chromecast')
const Channel = require('../models/Channel')

const port = require('../lib/config').port

router.use((req, res, next) => {
  if (req.body.URLs) req.body.URLs = req.body.URLs.filter(u => u.trim() != '')
  next()
})

router.get('/', (req, res) => {
  res.render('index', { render: 'channels', channels: channels.list() })
})

router
  .route('/new')
  .get((req, res) => {
    res.render('index', {
      render: 'channel',
      host: `${req.protocol}://${req.hostname}:${port}/`
    })
  })
  .post((req, res) => channels.create(req.body, id => res.send(id)))

router.get('/:channel_id', (req, res) => {
  let channel = channels.withId(req.params.channel_id)
  if (channel)
    res.render(`layouts/${channel.layout}`, {
      channel: channel,
      casting: false
    })
  else res.render('layouts/empty', { casting: false })
})

router
  .route('/:channel_id/edit')
  .get((req, res) => {
    let channel = channels.withId(req.params.channel_id)
    if (channel)
      res.render('index', {
        render: 'channel',
        channel: channel,
        host: `${req.protocol}://${req.hostname}:${port}/`
      })
    else res.render('index', {})
  })
  .post((req, res) => channels.update(req.params.channel_id, req.body, id => res.send(id)))
  .delete((req, res) => channels.remove(req.params.channel_id, () => res.sendStatus(200)))

module.exports = router