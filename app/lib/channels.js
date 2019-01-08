'use strict'

const Channel = require('../models/Channel')

const devices = require('./devices')

let channels = []

const getMaxSectionCount = layout => {
  switch (layout || '') {
    case 'right-panel':
      return 2
    default:
    case 'fullscreen':
      return 1
  }
}

const cleanChannelUrls = channelOpts => {
  const cleaned = { URLs: [] }

  const maxSectionCount = getMaxSectionCount(channelOpts.layout)

  Object.keys(channelOpts).forEach(key => {
    if (key.startsWith('URLs')) {
      const keyIdx = parseInt(key.substring(5, key.length - 1))

      if (!Number.isNaN(keyIdx) && keyIdx < maxSectionCount) {
        cleaned.URLs[keyIdx] = channelOpts[key]
      }
    } else {
      cleaned[key] = channelOpts[key]
    }
  })

  return cleaned
}

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
    var c = new Channel(cleanChannelUrls(opts))
    c.save((err, channel) => {
      if (err) console.log(err)
      channels.push(c)
      callback(channel._id)
    })
  },
  update: (id, opts, callback) => {
    Channel.update({ _id: id }, opts, err => {
      Object.assign(func.withId(id), cleanChannelUrls(opts))
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
