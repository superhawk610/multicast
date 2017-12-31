'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChannelSchema = new Schema({
  name: String,
  layout: String,
  URLs: [[String]],
  duration: Number
})

module.exports = mongoose.model('Channel', ChannelSchema)
