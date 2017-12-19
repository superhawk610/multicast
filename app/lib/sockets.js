'use strict'

const stripIPv6 = require('./stripIPv6')
let io

let clients = []

const func = {
  init: server => {
    io = require('socket.io')(server)
    io.on('connection', client => {
      console.log('added client with host:', stripIPv6(client.handshake.address))
      clients.push(client)
      client.on('disconnect', () => {
        console.log('disconnected client with host:', stripIPv6(client.handshake.address))
        clients.splice(clients.indexOf(client), 1)
      })
    })
  },
  list: () => clients,
  withHost: host => clients.find(c => stripIPv6(c.handshake.address) == host)
}

module.exports = func