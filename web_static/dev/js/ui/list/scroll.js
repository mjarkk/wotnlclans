import React, { useState, useEffect, createRef } from 'react'
import n from '../../funs/networking'
import f from '../../funs/functions'

export default function ScrollWatch({
  state,
  setState,
  setFetchedClans,
  haveClanIds,
  setHaveClanIds,
  list,
  setList,
  setSortOn,
  sortOn,
  sortedLists,
  setSortedLists,
  lastListItem,
}) {
  const [scrollFromTop, setScrollFromTop] = useState(0)

  const scrollEvHandeler = () => {
    setScrollFromTop(document.documentElement.scrollTop)
  }

  useEffect(() => {
    if (!lastListItem.current) {
      return
    }

    if (scrollFromTop + window.innerHeight + 600 <= lastListItem.current.offsetTop || state.isFetchingData || state.haveAllClans) {
      return
    }

    setState(s => ({
      ...s,
      isFetchingData: true
    }))
    const sortedList = sortedLists[sortOn]
    if (sortedList) {
      const toFetch = []
      for (let i = 0; i < sortedList.length; i++) {
        const clanID = sortedList[i]
        if (!haveClanIds[clanID]) {
          if (toFetch.length < 50) {
            toFetch.push(clanID)
          } else {
            break
          }
        }
      }

      if (toFetch.length != 0) {
        n.getClansByID(toFetch).then(out => {
          if (out.status) {
            toFetch.map(id => {
              haveClanIds[id] = true
            })

            f.setCurrentClans(out.data)

            setFetchedClans(n => n + 50)
            setHaveClanIds(haveClanIds)
            setState(s => ({
              ...s,
              isFetchingData: false,
            }))
            setList(l => [...l, ...out.data])
          } else {
            // something went wrong on the server side
          }
        })
      } else {
        setState(s => ({
          ...s,
          haveAllClans: true,
          isFetchingData: false
        }))
        // show there are not more clans to fetch
      }
    }
  }, [scrollFromTop])

  const getNeededInfo = async () => {
    const list = await n.getClanList()

    const iconsLocation = f.clanIconsToIndex(await n.getIconsLocation())
    const iconsPicture = await n.getIconsPicture()
    setState(s => ({
      ...s,
      iconsLocation,
      iconsPicture
    }))
    const img = document.createElement('img')
    img.onload = () => {
      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight
      const maxLocations = Object.keys(iconsLocation).reduce((acc, id) => {
        const item = iconsLocation[id]
        if (item.x > acc.x) {
          acc.x = item.x
        }
        if (item.y > acc.y) {
          acc.y = item.y
        }
        return acc
      }, { x: 0, y: 0 })
      maxLocations.x++
      maxLocations.y++
      setState(s => ({
        ...s,
        imgSize: {
          height: imgHeight,
          width: imgWidth,
          oneItem: imgHeight / maxLocations.y
        }
      }))
    }
    img.src = iconsPicture
    const out = await n.getFilteredList()
    if (out.status) {
      const sortOn = f.map_sorting(out.default)
      const sortedLists = f.clanPos(out.data)
      const haveClanIds = f.haveClanIds(sortedLists, sortOn)
      setHaveClanIds(haveClanIds)
      setSortOn(sortOn)
      setSortedLists(sortedLists)

      window.addEventListener('scroll', scrollEvHandeler)
    } else {
      // show error
    }
    f.setCurrentClans(list)
    setList(list)
  }

  useEffect(() => {
    getNeededInfo()
    return () => {
      window.removeEventListener('scroll', scrollEvHandeler)
    }
  }, [])

  return (<></>)
}
