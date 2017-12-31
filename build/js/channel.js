$('#channel-layout .layout').on('click', function() {
  $(this)
    .addClass('active')
    .siblings()
    .removeClass('active')
  if ($(this).is('.fullscreen'))
    $('.display-section')
      .find('input')
      .slice(1)
      .val('')
      .end()
      .end()
      .hide()
      .eq(0)
      .show()
  if ($(this).is('.right-panel'))
    $('.display-section')
      .hide()
      .slice(0, 2)
      .show()
})

$('#edit-channel [type="submit"]').on('click', function(e) {
  e.preventDefault()
  $('input.is-error').removeClass('is-error')
  $empty = $('#edit-channel input:visible').filter(function() {
    return !this.value
  })
  $empty.addClass('is-error')
  if ($empty.length || !$('.layout.active').length) {
    notify({
      message: 'Please fill out all fields and select a layout before saving.',
      style: 'error'
    })
  } else {
    var $layout = $('#channel-layout .layout.active'),
      layout,
      duration = $('#rotation-duration .btn-primary').attr('data-duration')
    if ($layout.is('.fullscreen')) layout = 'fullscreen'
    if ($layout.is('.right-panel')) layout = 'right-panel'
    $.ajax({
      method: 'post',
      data: `${$(
        '#edit-channel'
      ).serialize()}&layout=${layout}&duration=${duration}`,
      success: function(response) {
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

$('#channel-list').on('click', '.add-url', function() {
  var $section = $(this).prev(),
    $prev = $section.find('.form-group').last(),
    id =
      parseInt(
        $prev
          .find('label')
          .text()
          .split(' ')
          .pop()
      ) + 1,
    groupId =
      $section
        .find('label')
        .first()
        .text()
        .split(' ')
        .pop() - 1
  $section.append(`
    <div class="form-group">
      <label class="form-label">URL ${id}</label><input class="form-input input-lg pad-right" type="text" name="URLs[${groupId}]" placeholder="http://192.168.1.100/page.html">
      <button class="btn btn-lg btn-link remove-url">
        <i class="fa fa-trash"></i>
      </button>
    </div>
  `)
  return false
})

$('#channel-list').on('click', '.remove-url', function() {
  $(this)
    .parent()
    .remove()
  return false
})

$('#rotation-duration .btn').on('click', function() {
  $(this)
    .addClass('btn-primary')
    .siblings()
    .removeClass('btn-primary')
  return false
})
