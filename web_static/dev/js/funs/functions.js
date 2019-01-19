import sortBy from 'lodash.sortby'
import reverse from 'lodash.reverse'
import bowser from 'bowser'

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
    return reverse(sortBy(list, [o => o.stats[what], o => o.stats.winratio]))
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
  },
  isNumbers(input) {
    return input.split('').reduce((acc, curr) => !/[0-9]/.test(curr) ? false : acc, true)
  },
  isClanId(input) {
    return (
      typeof input == 'string' 
      && input.length == 9 
      && this.isNumbers(input)
    )
  },
  supportsWebp() {
    const browser = bowser.getParser(window.navigator.userAgent) .parsedResult.browser
    const name = browser.name || ''
    const version = browser.version || ''
    return (
      name == 'Chrome' && Number(version.split('.')[0]) >= 23
      || name == 'Edge' && Number(version.split('.')[0]) >= 18
      || name == 'Opera' && Number(version.split('.')[0]) >= 13
      || name == 'Firefox' && Number(version.split('.')[0]) >= 65
    )
  },
  clanPos(data) {
    let toReturn = {}
    let actualDataKeys = Object.keys(data.actualData)
    let arrLen = actualDataKeys.length
    data.dataMapping.map(item => {
      toReturn[item] = Array.from(new Array(arrLen))
    })
    actualDataKeys.map(clanID => {
      data.actualData[clanID].map((pos, i) => {
        toReturn[data.dataMapping[i]][pos] = clanID
      })
    })
    return toReturn
  },
  haveClanIds(data, sortOn) {
    return data[sortOn].reduce((acc, curr, id) => {
      acc[curr] = id < 50
      return acc
    }, {})
  }
}
