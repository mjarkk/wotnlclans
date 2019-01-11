import sortBy from 'lodash.sortby'
import reverse from 'lodash.reverse'

const deskTopSize = 1200 
let screenPosition = document.body.offsetWidth < deskTopSize

export default {
  clanIconsToIndex(input) {
    let toReturn = {}
    input.map((yline, y) => {
      yline.map((clanId, x) => {
        toReturn[clanId] = {y, x}
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
  },
  watchScreenSize(cb) {
    cb(screenPosition)
    window.onresize = () => {
      const newPos = document.body.offsetWidth < deskTopSize
      if (newPos != screenPosition) {
        screenPosition = newPos
        cb(newPos)
      }
    }
  }
}
