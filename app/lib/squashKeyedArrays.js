module.exports = (obj, upgradeElementsToArrays) => {
  let keys = Object.keys(obj),
    arrays = []
  keys.forEach(k => {
    let key = /(.+)\[\d+\]$/.exec(k)
    if (key && arrays.indexOf(key[1]) == -1) arrays.push(key[1])
  })

  arrays.forEach(a => {
    let _arr = {},
      arr = [],
      highestIndex = 0
    keys.forEach(k => {
      let index = new RegExp(`${a}\\[(\\d+)\\]`).exec(k)
      if (index) {
        highestIndex = Math.max(highestIndex, index)
        let item = obj[k]
        if (upgradeElementsToArrays && !Array.isArray(item)) item = [item]
        arr[index[1]] = item
        delete obj[k]
      }
    })
    for (let i = 0; i < highestIndex; i++) {
      if (_arr.hasOwnProperty(i)) arr.push(_arr[i])
      else arr.push(upgradeElementsToArrays ? [] : null)
    }
    obj[a] = arr
  })
  return obj
}
