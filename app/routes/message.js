'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const devices = require('../lib/devices')
const messageFile = path.resolve(__dirname, '..', '..', 'message.txt')

router.get('/', (req, res) => {
  fs.readFile(messageFile, (err, data) => {
    if (err || data == '')
      res.render('message', { message: 'No message configured.' })
    else res.render('message', { message: data })
  })
})

router
  .route('/edit')
  .get((req, res) => {
    fs.readFile(messageFile, (err, data) => {
      if (err) res.render('message-edit', { message: '' })
      else res.render('message-edit', { message: data })
    })
  })
  .post((req, res) => {
    fs.writeFile(messageFile, req.body.message, err => console.log(err))
    devices.refreshChannelPath('message')
    res.sendStatus(200)
  })

module.exports = router