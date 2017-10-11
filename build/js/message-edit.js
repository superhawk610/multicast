$('[type="submit"]').on('click', function(e) {
  e.preventDefault()
  $.ajax({
    method: 'post',
    data: { message: $('#message-text').val() },
    success: function(response) {
      window.location = '/'
    }
  })
})