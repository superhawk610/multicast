'use strict'

const express = require('express')
const router = express.Router()
'use strict'

const channels = require('../lib/channels')
const takeover = require('../lib/takeover')

router
  .route('/')
  .get((req, res) => {
    res.render('index', { render: 'takeover', channels: channels.list() })
  })
  .post((req, res) => {
    console.log('activating takeover!')
    takeover.activate(req.body.channel_id, () => res.sendStatus(200))
  })

router.post('/end', (req, res) => {
  takeover.deactivate(() => res.sendStatus(200))
})

module.exports = router