function tick() {
  var d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    amPm = 'AM'
  // convert to 12 hr time
  if (h > 12) {
    amPm = 'PM'
    h -= 12
  }
  if (h == 12) amPm = 'PM'
  if (h == 0) h = 12

  $('#clock').text(h + ':' + pad(m) + ' ' + amPm)
  setTimeout(function () { tick() }, 1000)
}

function pad(num) {
  if (num < 10) num = '0' + num
  return num
}

if ($('#clock').length) tick()