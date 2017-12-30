'use strict'

const Client = require('castv2').Client
const config = require('./config')

let func = {
    establish: (d, disconnectCallback) => {
      let host = d.address
      d.connectionFailCount = 0
      if (d.status == 'offline' || d.status == 'waiting') {
        const client = new Client()
        client.connect(host, () => {
          // reset number of failed connection attempts
          d.connectionFailCount = 0

          // create various namespace handlers
          d.connection = client.createChannel(
            'sender-0',
            'receiver-0',
            'urn:x-cast:com.google.cast.tp.connection',
            'JSON'
          )
          d.heartbeat = client.createChannel(
            'sender-0',
            'receiver-0',
            'urn:x-cast:com.google.cast.tp.heartbeat',
            'JSON'
          )
          d.receiver = client.createChannel(
            'sender-0',
            'receiver-0',
            'urn:x-cast:com.google.cast.receiver',
            'JSON'
          )

          // establish virtual connection to the receiver
          d.connection.send({ type: 'CONNECT' })

          // start heartbeating
          d.missedHeartbeats = 0
          d.pulse = setInterval(() => {
            d.missedHeartbeats++
            if (d.missedHeartbeats > 6) {
              // receiver has been offline for more than 30 seconds
              d.status = 'offline' // mark receiver as offline
              clearInterval(d.pulse) // stop checking for pulse :(
              func.addError(
                d,
                'Receiver missed too many heartbeats, it is likely offline.'
              )
            } else d.heartbeat.send({ type: 'PING' })
          }, 5 * 1000)
          d.heartbeat.on('message', (data, broadcast) => {
            if (data.type == 'PONG') {
              d.missedHeartbeats = 0
              d.status = 'online'
              func.clearErrors(d)
            }
          })

          // launch hub app
          d.receiver.send({ type: 'LAUNCH', appId: config.appId, requestId: 1 })

          // monitor receiver status updates to insure hub is open
          d.receiver.on('message', (data, broadcast) => {
            if (data.type != 'RECEIVER_STATUS')
              func.addError(d, `Message from receiver: ${data.type}`)
            if ((data.type = 'RECEIVER_STATUS')) {
              // data.status contains relevant information about current app, volume, etc
              if (data.status && data.status.applications) {
                var apps = data.status.applications

                /* Backdrop means that our hub applications has stopped running, so we need to restart it */
                if (apps.find(a => a.displayName == 'Backdrop')) {
                  func.addError(d, 'Receiver closed hub, relaunching...')
                  d.receiver.send({
                    type: 'LAUNCH',
                    appId: config.appId,
                    requestId: 1
                  })
                }
              }
            }
          })
        })
        client.on('error', () => {
          d.connectionFailCount++
          if (d.connectionFailCount > 6) {
            // receiver hasn't responded after 60 seconds
            clearTimeout(d.connectionFail)
            func.addError(
              d,
              'Receiver is unresponsive, attempting to reconnect...'
            )
          } else d.connectionFail = setTimeout(disconnectCallback, 10 * 1000)
        })
      }
    },
    hasErrors: () => Object.keys(errors).length > 0,
    getErrors: () => errors,
    addError: (device, message) => {
      if (!errors[device.deviceId])
        errors[device.deviceId] = {
          name: device.location,
          messages: []
        }
      if (errors[device.deviceId].messages.indexOf(message) == -1)
        errors[device.deviceId].messages.push(message)
    },
    clearErrors: device => delete errors[device.deviceId]
  },
  errors = {}

module.exports = func
