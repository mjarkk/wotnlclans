import sortBy from 'lodash.sortby'
import reverse from 'lodash.reverse'

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
    switch (what) {
      case 'globalRating':
        return reverse(sortBy(list, [o => o.stats.globRatingweighted, o => o.stats.winratio]))
      case 'winratio':
        return reverse(sortBy(list, [o => o.stats.winratio, o => o.stats.globRatingweighted]))
      default:
        console.warn(`${what} is not a sort option the options are: globalRating or winratio`)
        return list
    }
  }
}
