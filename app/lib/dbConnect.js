const mongoose = require('mongoose')

module.exports = config => {
  const userPassword = config.mongoUser ? `${config.mongoUser}:${config.mongoPass}@` : ''
  mongoose.connect(
    `mongodb://${userPassword}${config.mongoHost}:${config.mongoPort}/multicast?authSource=${config.mongoAuthSource}`, {
    useMongoClient: true
  }).on('error', () => console.log('Could not connect to Mongo.'))
}