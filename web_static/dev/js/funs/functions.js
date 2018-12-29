export default {
  clanIconsToIndex(input) {
    let toReturn = {}
    input.map((el, y) => {
      el.map((clanId, x) => {
        toReturn[clanId] = {x,y}
      })
    })
    return toReturn
  },
  sortList(what, list) {
    if (list.length == 0) {
      return list
    }
    const selector = what.split('.')
    return list.sort((a, b) => {
      const out = selector.reduce((acc, cur) => acc.map(item => item[cur]), [a,b])
      return out[0] - out[1]
    })
  }
}
