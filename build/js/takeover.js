$('[type="submit"]').on('click', function() {
  if (confirm('Are you sure? This will take over ALL active devices on the network registered to your Google account, registered and unregistered.')) {
    $.ajax({
      method: 'post',
      data: { channel_id: $('#device-channel').val() },
      success: function(response) {
        window.location = '/'
      }
    })
  }
  return false
})