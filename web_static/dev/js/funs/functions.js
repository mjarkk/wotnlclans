import sortBy from 'lodash.sortby'
import reverse from 'lodash.reverse'
import n from './networking'
import bowser from 'bowser'

let currentClans = {}

const deskTopSize = 1200
let screenPosition = document.body.offsetWidth < deskTopSize

export default {
  setCurrentClans(newList) {
    currentClans = newList.reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})
  },
  async getSpesificClan(id) {
    if (currentClans[id]) {
      return currentClans[id]
    } else {
      const out = await n.getClansByID([id])
      if (out.status && out.data.length > 0) {
        return out.data[0]
      } else {
        return undefined
      }
    }
  },
  clanIconsToIndex(input) {
    let toReturn = {}
    input.map((yline, y) => {
      yline.map((clanId, x) => {
        toReturn[clanId] = { y, x }
      })
    })
    return toReturn
  },
  sortList(what, list) {
    if (what == 'global') {
      what = 'glob_rating'
    }

    let foundItems = {}
    return reverse(sortBy(list, [o => o.stats[what], o => o.stats.win_ratio])).filter(item => {
      if (foundItems[item.id]) return false
      foundItems[item.id] = true
      return true
    })
  },
  watchScreenSize(cb) {
    cb(screenPosition)
    window.addEventListener('resize', () => {
      const newPos = document.body.offsetWidth < deskTopSize
      if (newPos != screenPosition) {
        screenPosition = newPos
        cb(newPos)
      }
    })
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
    const browser = bowser.getParser(window.navigator.userAgent).parsedResult.browser
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
    let statsKeys = Object.keys(data.stats)
    let arrLen = statsKeys.length
    data.data_mapping.map(item => {
      toReturn[item] = Array.from(new Array(arrLen))
    })
    statsKeys.map(clanID => {
      data.stats[clanID].map((pos, i) => {
        toReturn[data.data_mapping[i]][pos] = clanID
      })
    })
    return toReturn
  },
  haveClanIds(data, sortOn) {
    return data[sortOn].reduce((acc, curr, id) => {
      acc[curr] = id < 50
      return acc
    }, {})
  },
  map_sorting(name) {
    return {
      'Members': 'members',
      'Battles': 'battles',
      'Dailybattles': 'daily_battles',
      'Efficiency': 'efficiency',
      'Fbelo10': 'fb_elo10',
      'Fbelo8': 'fb_elo8',
      'Fbelo6': 'fb_elo6',
      'Fbelo': 'fb_elo',
      'Gmelo10': 'gm_elo10',
      'Gmelo8': 'gm_elo8',
      'Gmelo6': 'gm_elo6',
      'Gmelo': 'gm_elo',
      'Globrating': 'glob_rating',
      'GlobRatingweighted': 'glob_rating_weighted',
      'Winratio': 'win_ratio',
      'V10l': 'v10l',
    }[name] || name
  }
}

