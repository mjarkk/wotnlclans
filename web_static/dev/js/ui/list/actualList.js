import React, { useState, useEffect } from 'react'
import f from '../../funs/functions'
import d from '@loadable/component'

const SVG = d(() => import('../../els/svg'))

const transfromToMatch = input =>
  !input ? '' : input
    .replace(/0/g, 'o')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .toUpperCase()

export default function ActualList({ sortOn, list, searchQuery, setLastListItem, state }) {
  const [sortedList, setSortedList] = useState([])

  useEffect(() => {
    setSortedList(f.sortList(sortOn, list))
  }, [sortOn, list])

  const formattedSearchQuery = transfromToMatch(searchQuery)
  return (
    sortedList.map((item, id) => {
      const loc = state.iconsLocation[item.id]
      return (
        <div
          style={{
            display:
              formattedSearchQuery == ''
                || transfromToMatch(item.tag).indexOf(formattedSearchQuery) != -1
                || transfromToMatch(item.name).indexOf(formattedSearchQuery) != -1
                ? 'grid'
                : 'none'
          }}
          key={id}
          className="row"
          onClick={() => {
            location.hash = `/clan/${item.id}`
          }}
          ref={htmlEl => {
            if (id == (sortedList.length - 1)) {
              setLastListItem(lastListItem => {
                lastListItem.current = htmlEl
                return lastListItem
              })
            }
          }}
        >
          <div className="position">{id + 1}</div>
          <div className="icon">
            <div className="holder" style={{
              backgroundImage: loc ? `url(${state.iconsPicture})` : '',
              backgroundPosition: loc ? `-${loc.x * 60}px -${loc.y * 60}px` : '',
            }}></div>
          </div>
          <div className="tag">[{item.tag}]</div>
          <div className="rating clanEfficiency">
            <span>Rating</span>
            <span>{item.stats.efficiency}</span>
          </div>
          <div className="rating clanRating">
            <span>Global</span>
            <span>{item.stats.glob_rating}</span>
          </div>
          <div className="rating winrate">
            <span>Winrate</span>
            <span>{item.stats.win_ratio}%</span>
          </div>
          <div className="rating global">
            <span>Global 10</span>
            <span>{item.stats.gm_elo10}</span>
          </div>
          <div className="rating stronghold">
            <span>Stronghold</span>
            <span>{item.stats.fb_elo}</span>
          </div>
          <div className="rating members">
            <span>Members</span>
            <span>{item.members}</span>
          </div>
          <div className="rating battles">
            <span>Battles</span>
            <span>{item.stats.battles}</span>
          </div>
          <div className="moreinfo">
            <SVG icon="arrow" />
          </div>
        </div>
      )
    })
  )
}
