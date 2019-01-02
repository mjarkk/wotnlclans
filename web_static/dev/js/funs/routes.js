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
    const clans = await net.getClanList()
    const showClan = clans.reduce((acc, clan) => clan.id == clanID ? clan : acc ,undefined)
    return ns({index: {showClan}})
  }
})

export default {
  init() {
    return route((location.hash || '#').slice(1))
  }
}
