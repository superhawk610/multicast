'use strict'

const express = require('express')
const router = express.Router()

const sockets = require('../lib/sockets')

router.route('/')
.get((req, res) => {
  res.render('index', { render: 'push' })
})
.post((req, res) => {
  sockets.list().forEach(c => {
    c.emit('push', {
      message: req.body.message,
      style: req.body.style,
      duration: req.body.duration
    })
  })
  res.sendStatus(200)
})

module.exports = router