'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChromecastSchema = new Schema({
  deviceId: String, // hexadecimal identifier provided by Chromecast
                    // don't confuse this with _id provided by Mongo
  location: String,
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
})

module.exports = mongoose.model('Chromecast', ChromecastSchema)