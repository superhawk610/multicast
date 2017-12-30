'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChromecastSchema = new Schema({
  deviceId: String, // hexadecimal identifier provided by Chromecast
  location: String,
  rotation: String,
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' }
})

module.exports = mongoose.model('Chromecast', ChromecastSchema)
