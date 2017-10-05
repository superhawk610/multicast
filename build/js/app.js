notifyIsActive = false
function notify(opts) {
  if (notifyIsActive) return
  notifyIsActive = true
  var title = opts.title || '',
      msg = opts.message || '',
      style = opts.style != '' ? `toast-${opts.style}` : '',
      full = opts.fullWidth || false,
      dur = opts.duration || 3000
  $('#toast').find('.title').text(title).end()
             .find('.text').text(msg).end()
             .addClass(`${style}${full ? ' full-width' : ''}`).fadeIn()
  setTimeout(function() {
    $('#toast').fadeOut(500, function() {
      $('#toast').removeClass(`${style} full-width`)
      notifyIsActive = false
    })
  }, dur)
}