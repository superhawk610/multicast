notifyIsActive = false
function notify(opts) {
  if (notifyIsActive) return
  notifyIsActive = true
  var title = opts.title || '',
      msg = opts.message || '',
      style = opts.style || 'primary',
      full = opts.fullWidth || false,
      dur = opts.duration || 3000
  $('#toast').find('.title').text(title).end()
             .find('.text').text(msg).end()
             .addClass(`toast-${style}${full ? ' full-width' : ''}`).fadeIn()
  setTimeout(function() {
    $('#toast').fadeOut(500, function() {
      $('#toast').removeClass(`toast-${style} full-width`)
      notifyIsActive = false
    })
  }, dur)
}