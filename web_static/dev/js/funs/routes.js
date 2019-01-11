import rlite from 'rlite-router'
import net from './networking'
import funs from './functions'

const defaultState = {
  index: {
    currentPage: 'list',
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
        showClan: funs.sortList('globalRating', await net.getClanList())
          .reduce(
            (acc, clan, id) => clan.id == clanID ? Object.assign({}, clan, {clanPosition: id + 1}) : acc
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
