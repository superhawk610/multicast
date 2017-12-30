/* socket.io */
var socket = io()

console.log('establishing socket.io connection')

socket.on('connect', function () { console.log('connection established!') })
socket.on('disconnect', function() { })
socket.on('refresh', function() { location.reload(true) })

socket.on('register', function(device_id) {
  window.location = `/device/${device_id}`
})

socket.on('change_channel', function(channel) {
  // request hard reload to get new channel settings
  location.reload(true)
})

socket.on('push', function(opts) {
  notify({
    title: opts.message,
    style: opts.style,
    duration: parseInt(opts.duration),
    fullWidth: true
  })
})

/* Google Cast */
if (cast) {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  console.log('Starting Receiver Manager');
  // handler for the 'ready' event
  castReceiverManager.onReady = function (event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState($(document).find('title').text());
  };
  // handler for 'senderconnected' event
  castReceiverManager.onSenderConnected = function (event) {
    console.log('Received Sender Connected event: ' + event.data);
    console.log(window.castReceiverManager.getSender(event.data).userAgent);
  };
  // handler for 'senderdisconnected' event
  castReceiverManager.onSenderDisconnected = function (event) {
    console.log('Received Sender Disconnected event: ' + event.data);
    if (window.castReceiverManager.getSenders().length == 0) {
      window.close();
    }
  };
  // handler for 'systemvolumechanged' event
  castReceiverManager.onSystemVolumeChanged = function (event) {
    console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
      event.data['muted']);
  };
  // create a CastMessageBus to handle messages for a custom namespace
  window.messageBus =
    window.castReceiverManager.getCastMessageBus(
      'urn:x-cast:com.unitedcatalystcorporation.ucc-utility');
  // handler for the CastMessageBus message event
  window.messageBus.onMessage = function (event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);
    // display the message from the sender
    displayText(event.data);
    // inform all senders on the CastMessageBus of the incoming message event
    // sender message listener will be invoked
    window.messageBus.send(event.senderId, event.data);
  }
  // initialize the CastReceiverManager with an application status message
  window.castReceiverManager.start({ statusText: 'Loading Hub...' });
  console.log('Receiver Manager started');
}