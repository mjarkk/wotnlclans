import rlite from 'rlite-router'
import f from './functions'

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
        showClan: await f.getSpesificClan(clanID)
      }
    })
  },
  'settings': async () => ns({
    index: {
      currentPage: 'settings'
    }
  }),
  'community': async () => ns({
    index: {
      currentPage: 'community'
    }
  })
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
