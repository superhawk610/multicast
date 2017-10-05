$('#stop-takeover').on('click', function() {
  if (confirm('Are you sure?')) {
    $.post({
      url: '/takeover/end',
      success: function() {
        location.reload()
      }
    })
  }
  return false
})