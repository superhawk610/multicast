const mongoose = require('mongoose');

module.exports = function dbConnect(config) {
  const userPassword = config.mongoUser ? `${config.mongoUser}:${config.mongoPass}@` : '';
  mongoose.connect(
    `mongodb://${userPassword}${config.mongoHost}:${config.mongoPort}/multicast?authSource=${config.mongoAuthSource}`, {
    useMongoClient: true
  });
}