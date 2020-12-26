import React, { useState, useEffect, createRef } from 'react'
import n from '../../funs/networking'
import ActualList from './actualList'
import ScrollWatch from './scroll'

export default function GetData({ sortOn, setSortOn, searchQuery, state, setState }) {
  const [list, setList] = useState([])
  let [haveClanIds, setHaveClanIds] = useState({})
  const [fetchedClans, setFetchedClans] = useState(50)
  const [search, setSearch] = useState({ buzzy: false, lastSearchQuery: '' })
  const [sortedLists, setSortedLists] = useState(undefined)
  const [lastListItem, setLastListItem] = useState(createRef())

  useEffect(() => {
    if (!sortedLists) {
      return
    }

    let toFetch = [[]]
    const sortedList = sortedLists[sortOn]
    for (let i = 0; i < sortedList.length; i++) {
      if (i < fetchedClans) {
        const id = sortedList[i]
        const isTrue = haveClanIds[id]
        if (!isTrue) {
          if (toFetch[toFetch.length - 1].length == 50) {
            toFetch.push([])
          }
          toFetch[toFetch.length - 1].push(id)
        }
      } else {
        break
      }
    }

    toFetch.reduce((acc, curr) => { acc.push(...curr); return acc }, []).map(id => {
      haveClanIds[id] = true
    })
    setHaveClanIds(haveClanIds)

    toFetch.map(toFetchSubArr => {
      if (toFetchSubArr.length == 0) {
        return
      }
      n.getClansByID(toFetchSubArr).then(clans => {
        if (clans.status) {
          setList(l => [...l, ...clans.data])
        }
      })
    })
  }, [sortOn])

  useEffect(() => {
    if (search.buzzy || !searchQuery) {
      return
    }

    setSearch({
      buzzy: true,
      lastSearchQuery: searchQuery
    })
    setTimeout(async () => {
      const out = await n.search(searchQuery, sortOn)
      if (out.status) {
        const toFetch = []
        out.data.map(id => {
          if (!haveClanIds[id]) {
            haveClanIds[id] = true
            toFetch.push(id)
          }
        })
        setHaveClanIds(haveClanIds)

        const clans = toFetch.length == 0 ? { status: false } : await n.getClansByID(toFetch)
        if (clans.status) {
          setList(l => ([...l, ...clans.data]))
        }
      }
      setTimeout(() => {
        // TODO check if filter has actually been changed
        if (searchQuery != searchQuery) {
          // TODO add this function
          searchForClans(state, true)
        } else {
          setSearch({
            buzzy: false,
            lastSearchQuery: searchQuery
          })
        }
      }, 50)
    }, 50)
  }, [searchQuery])

  return (
    <>
      <ScrollWatch
        state={state}
        setState={setState}
        setFetchedClans={setFetchedClans}
        haveClanIds={haveClanIds}
        setHaveClanIds={setHaveClanIds}
        list={list}
        setList={setList}
        setSortOn={setSortOn}
        sortOn={sortOn}
        sortedLists={sortedLists}
        setSortedLists={setSortedLists}
        lastListItem={lastListItem}
      />

      {list.length == 0 ?
        <div className="loading">loading...</div>
        :
        <ActualList
          list={list}
          sortOn={sortOn}
          setLastListItem={setLastListItem}
          searchQuery={searchQuery}
          state={state}
        />
      }
    </>
  )
}
