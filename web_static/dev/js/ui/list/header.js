import React from 'react'
import d from '@loadable/component'

const Search = d(() => import('../../els/search'))
const Button = d(() => import('../../els/button'))

export default function ListHeader({ setSortOn, sortOn, setSearchQuery }) {
  const options = [
    ['efficiency', 'Rating'],
    ['global', 'Global'],
    ['win_ratio', 'Winrate'],
    ['fb_elo', 'Strongholds'],
    ['battles', 'Battles'],
    ['gm_elo10', 'Global 10']
  ]

  return (
    <>
      <div className="title">
        <h2>Topclans</h2>
      </div>
      <div className="filters">
        <Search
          placeholder="Search for clans"
          onChange={setSearchQuery}
        />
        <div className="filterOnList">
          {options.map((option, key) =>
            <Button
              key={key}
              style={sortOn == option[0] || (sortOn == '' && key == 0) ? 'selected' : 'outline'}
              click={() => setSortOn(option[0])}
              title={option[1]}
            />
          )}
        </div>
      </div>
    </>
  )
}
