import 'unfetch/polyfill'

let clansList = {
  started: false,
  hasData: false,
  hasError: false,
  data: false,
  isWaitingForData: []
}

let clanIcons = {
  png: {
    started: false,
    hasData: false,
    data: false,
    isWaitingForData: []
  },
  json: {
    started: false,
    hasData: false,
    data: false,
    isWaitingForData: []
  }
}

const getClanList = async() => {
  if (clansList.hasData) {
    if (clansList.hasError) {
      throw 'clandata has error'
    }
    return clansList.data
  } else if (clansList.started) {
    return await new Promise(resolve => {
      clansList.isWaitingForData.push(resolve)
    })
  } else {
    clansList.started = true
    const res = await fetch('/clanData')
    const data = await res.json()
    clansList.data = data.data
    clansList.hasError = data.hasError
    clansList.hasData = true
    clansList.isWaitingForData.map((resolve, reject) => {
      if (data.hasError) {
        reject('clandata has error')
      } else {
        resolve(data.data)
      }
    })
    return data.data
  }
}
const getIconsLocation = async() => {
  if (clanIcons.json.hasData) {
    return clanIcons.json.data
  } else if (clanIcons.json.started) {
    return await new Promise(resolve => {
      clanIcons.json.isWaitingForData.push(resolve)
    })
  } else {
    clanIcons.json.started = true
    const res = await fetch('/icons/json')
    const data = await res.json()
    clanIcons.json.data = data
    clanIcons.json.hasData = true
    clanIcons.json.isWaitingForData.map(resolve => resolve(data))
    return data
  }
}
const getIconsPicture = async() => {
  if (clanIcons.png.hasData) {
    return clanIcons.png.data
  } else if (clanIcons.png.started) {
    return await new Promise(resolve => {
      clanIcons.png.isWaitingForData.push(resolve)
    })
  } else {
    clanIcons.png.started = true
    const res = await fetch('/icons/png')
    const blob = await res.blob()
    const uri = URL.createObjectURL(blob)
    clanIcons.png.data = uri
    clanIcons.png.hasData = true
    clanIcons.png.isWaitingForData.map(resolve => resolve(uri))
    return uri
  }
}

const checkKey = async(userKey, userID) => {
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
  return data.status
}

export default {
  checkKey,
  getClanList,
  getIconsLocation,
  getIconsPicture
}
