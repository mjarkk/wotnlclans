import rlite from 'rlite-router'
import net from './networking'

const defaultState = {
  index: {
    currentPage: 'list',
    showLogin: false,
    isMobile: true,
    showClan: undefined
  }
}

const ns = newState => {
  return Object.keys(defaultState).reduce((acc, key) => {
    acc[key] = Object.assign(
      {}, 
      defaultState[key], 
      newState && newState[key] 
        ? newState[key] 
        : defaultState[key]
    )
    return acc
  }, {})
}

const route = rlite(async () => ns(), {
  'list': async () => ns(),
  '': async () => ns(),
  'clan/:clanID': async ({clanID}) => {
    return ns({
      index: {
        showClan: (await net.getClanList())
          .reduce(
            (acc, clan) => clan.id == clanID ? clan : acc 
            ,undefined
          )
      }
    })
  }
})

const getRoute = () => route((location.hash || '#').slice(1))

export default {
  init() {
    return getRoute()
  },
  watchHash(callback) {
    window.onhashchange = () => getRoute().then(newState => callback(newState)) 
  }
}
