import f from './functions'

let fetchEdUrls = {}

// fetchWCache is short for "fetch with cache" this function makes sure to not fetch something 2 times
const fetchWCache = (url, toBlob = false) => {
  const item = fetchEdUrls[url]
  return new Promise((resolve, reject) => {
    if (!item) {
      fetchEdUrls[url] = {
        hasData: false,
        data: false,
        status: true,
        isWaitingForData: []
      }

      const reqUrl = toBlob
        ? new Request(url)
        : url

      fetch(reqUrl).then(r => {
        if (toBlob) {
          return r.blob()
        } else {
          return r.json()
        }
      })
        .then(data => {
          fetchEdUrls[url].hasData = true
          if (toBlob) {
            fetchEdUrls[url].data = URL.createObjectURL(data)
          } else {
            fetchEdUrls[url].data = data
          }
          fetchEdUrls[url].status = true
          const resolveData = fetchEdUrls[url].data
          fetchEdUrls[url].isWaitingForData.map(waitItem => {
            waitItem.resolve(resolveData)
          })
          resolve(resolveData)
        })
        .catch(err => {
          fetchEdUrls[url].hasData = true
          fetchEdUrls[url].data = err
          fetchEdUrls[url].status = false
          fetchEdUrls[url].isWaitingForData.map(waitItem => {
            waitItem.reject(err)
          })
          reject(err)
        })
    } else if (item && item.hasData === false) {
      fetchEdUrls[url].isWaitingForData.push({ resolve, reject })
    } else {
      if (item.status) {
        resolve(item.data)
      } else {
        reject(item.data)
      }
    }
  })
}

const getClanList = async () => (await fetchWCache('/api/clanData')).data
const getIconsLocation = () => fetchWCache('/icons/allIcons.json')
const getIconsPicture = () => fetchWCache(f.supportsWebp() ? '/icons/allIcons.webp' : '/icons/allIcons.png', true)
const getFilteredList = () => fetchWCache('/api/clanIDs/all')

const checkKey = async (userKey, userID) => {
  const res = await fetch('/checkUser', {
    method: 'post',
    body: JSON.stringify({
      userKey,
      userID
    }),
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const data = await res.json()
  return data
}

const updateClanIDsList = async (userKey, userID, route, clans) =>
  await (await fetch(route, {
    method: 'post',
    body: JSON.stringify({
      userKey,
      userID,
      clans
    }),
    headers: {
      'Content-Type': 'application/json'
    },
  })).json()

const getClansByID = async (ids) =>
  await (await fetch(`/api/clanData/${ids.join('+')}`)).json()

const search = async (filter, sorting) =>
  fetchWCache(`/api/search/${encodeURIComponent(filter)}/${encodeURIComponent(sorting)}`)

const getDescription = async (clanID) => {
  const out = await fetchWCache(`/clanDescription/${clanID}`)
  return out.status ? out.data : ''
}

export default {
  updateClanIDsList,
  getIconsLocation,
  getFilteredList,
  getIconsPicture,
  getDescription,
  getClansByID,
  fetchWCache,
  getClanList,
  checkKey,
  search
}
