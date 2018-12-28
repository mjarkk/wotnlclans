export default {
  clanIconsToIndex(input) {
    let toReturn = {}
    input.map((el, y) => {
      el.map((clanId, x) => {
        toReturn[clanId] = {x,y}
      })
    })
    return toReturn
  }
}
