$('#channel-layout .layout').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active')
  if ($(this).is('.fullscreen')) $('.display-section').find('input').slice(1).val('').end().end().hide().eq(0).show()
  if ($(this).is('.right-panel')) $('.display-section').hide().slice(0, 2).show()
})

$('#edit-channel [type="submit"]').on('click', function (e) {
  e.preventDefault()
  $('input.is-error').removeClass('is-error')
  $empty = $('#edit-channel input:visible').filter(function() { return !this.value })
  $empty.addClass('is-error')
  if ($empty.length || !$('.layout.active').length) {
    notify({
      message: 'Please fill out all fields and select a layout before saving.',
      style: 'error'
    })
  } else {
    var $layout = $('#channel-layout .layout.active'),
        layout
    if ($layout.is('.fullscreen')) layout = 'fullscreen'
    if ($layout.is('.right-panel')) layout = 'right-panel'
    $.ajax({
      method: 'post',
      data: `${$('#edit-channel').serialize()}&layout=${layout}`,
      success: function (response) {
        window.location = '/channels'
      }
    })
  }
})

$('#delete-channel').on('click', function() {
  if (confirm('Are you sure? This action cannot be undone.')) {
    $.ajax({
      method: 'delete',
      success: function(response) {
        window.location = '/channels'
      }
    })
  }
  return false
})
