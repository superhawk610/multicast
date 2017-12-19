'use strict'

const Channel = require('../models/Channel')

const devices = require('./devices')

let channels = []

const func = {
  init: () => func.refresh(),
  refresh: () => {
    Channel.find()
      .sort('name')
      .exec((err, _channels) => {
        if (err) console.log(err)
        channels = _channels
      })
  },
  list: () => channels,
  withId: id => channels.find(c => c._id == id),
  create: (opts, callback) => {
    var c = new Channel(opts)
    c.save((err, channel) => {
      if (err) console.log(err)
      channels.push(c)
      callback(channel._id)
    })
  },
  update: (id, opts, callback) => {
    Channel.update({ _id: id }, opts, err => {
      Object.assign(func.withId(id), opts)
      opts._id = id
      devices.updateChannel(opts, () => callback(id))
    })
  },
  remove: (id, callback) => {
    Channel.remove({ _id: id }, () => {
      channels.splice(channels.findIndex(c => c._id == id), 1) // remove from local listing
      devices.removeChannel(id, () => callback())
    })
  }
}

module.exports = func