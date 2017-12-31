module.exports = obj => {
  let keys = Object.keys(obj)
  keys.forEach(k => {
    if (!obj[k]) delete obj[k]
  })
  return obj
}
