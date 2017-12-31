'use strict'

const Channel = require('../models/Channel')
const devices = require('../lib/devices')
const sockets = require('../lib/sockets')
const connection = require('../lib/connection')

var takeover = null

const func = {
  isActive: () => takeover != null,
  channel: () => takeover,
  activate: (channelId, callback) => {
    Channel.findOne({ _id: channelId }, (err, channel) => {
      if (err) console.log(err)

      takeover = channel
      connection.addStatus('takeover', 'Takeover is currently active!')
      devices.refreshAll(() => callback())
    })
  },
  deactivate: callback => {
    takeover = null
    connection.clearStatus('takeover')
    sockets.list().forEach(c => c.emit('refresh'))
    callback()
  }
}

module.exports = func
