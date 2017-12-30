notifyIsActive = false
function notify(opts) {
  if (notifyIsActive) return
  notifyIsActive = true
  var title = opts.title || '',
    msg = opts.message || '',
    style = opts.style != '' ? `toast-${opts.style}` : '',
    full = opts.fullWidth || false,
    dur = opts.duration || 3000
  $('#toast')
    .find('.title')
    .text(title)
    .end()
    .find('.text')
    .text(msg)
    .end()
    .addClass(`${style}${full ? ' full-width' : ''}`)
    .fadeIn()
  setTimeout(function() {
    $('#toast').fadeOut(500, function() {
      $('#toast').removeClass(`${style} full-width`)
      notifyIsActive = false
    })
  }, dur)
}

function displayError(message) {
  $('#error')
    .append(
      `<div>
        <span>Error!</span>
        ${message}
      </div>`
    )
    .show()
}

function checkFrame(frame) {
  var html,
    failed = false
  try {
    var doc = frame.contentDocument || frame.contentWindow.document
    html = doc.body.innerHTML
  } catch (e) {
    failed = true
  }

  if (!html) failed = true
  if (failed)
    displayError('Frame loading blocked due to cross-origin prevention')
}

$('iframe').each(function(i) {
  checkFrame(this)
})
