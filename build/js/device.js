$('#edit-device [type="submit"]').on('click', function(e) {
  e.preventDefault()
  $.ajax({
    method: 'post',
    data: $('#edit-device').serialize(),
    success: function(response) {
      window.location = '/devices'
    }
  })
})

$('#refresh-device').on('click', function() {
  $.get({
    url: 'connect',
    success: function (response) {
      notify({
        title: 'Success',
        message: 'Device has been successfully refreshed.',
        style: 'success'
      })
    }
  })
})

$('#reconnect-device').on('click', function() {
  $.get({
    url: 'connect',
    success: function(response) {
      notify({
        title: 'Reconnecting...',
        message: 'Attempting to reconnect to device. Check device now for status.'
      })
    }
  })
  return false
})

$('#delete-device').on('click', function () {
  if (confirm('Are you sure? This action cannot be undone.')) {
    $.ajax({
      method: 'delete',
      success: function (response) {
        window.location = '/devices'
      }
    })
  }
  return false
})