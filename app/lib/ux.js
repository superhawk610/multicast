'use strict'

const errors = [
    'Houston, we have a problem.',
    'Yikes!',
    "Something doesn't look right...",
    "Something's fishy."
  ],
  atRandom = arr => {
    let min = 0,
      max = arr.length - 1
    return arr[Math.floor(Math.random() * (max - min + 1)) + min]
  }

let func = {
  error: () => atRandom(errors)
}

module.exports = func
