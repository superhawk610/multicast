var maxLength = 150

/* Fix for Firefox-like browsers that persist data from previous page loads */
$('#char-counter').text(maxLength - $('#alert-text').val().length)

$('#alert-text').on('input', function(e) {
  $(this).removeClass('is-error')
  var length = $(this).val().length,
      rem = maxLength - length
  if (rem <= 0) $(this).val($(this).val().slice(0, -1))
  $(this).next('#char-counter').removeClass('text-gray text-warning text-error').text(rem)
  switch (true) {
    case (rem > 20):
      $('#char-counter').addClass('text-gray')
      break
    case (5 < rem && rem <= 20):
      $('#char-counter').addClass('text-warning')
      break
    case (rem <= 5):
      $('#char-counter').addClass('text-error')
      break
  }
})

$('#alert-style .toast').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active')
  return false
})

$('#alert-duration .btn').on('click', function() {
  $(this).addClass('btn-primary').siblings().removeClass('btn-primary')
  return false
})

$('#edit-alert [type="submit"]').on('click', function(e) {
  e.preventDefault()
  $('input.is-error').removeClass('is-error')
  if ($('#alert-text').val()) {
    $.ajax({
      method: 'post',
      data: {
        message: $('#alert-text').val(),
        style: $('#alert-style .toast.active').attr('data-style'),
        duration: $('#alert-duration .btn-primary').attr('data-duration')
      },
      success: function(response) {
        notify({
          title: 'Push Alert Sent!',
          message: `You alert has been pushed out to all connected devices, and will disappear after the set
                    amount of time. You will need to push it again to display on any newly connected devices.`,
          duration: 10 * 1000
        })
      }
    })
  } else {
    $('#alert-text').addClass('is-error')
    notify({
      message: 'Please enter alert text before submitting.',
      style: 'error'
    })
  }
  return false
})