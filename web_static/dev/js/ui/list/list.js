import React, { useState } from 'react'
import d from '@loadable/component'
import GetData from './getData'
import ListHeader from './header'

const Chart = d(() => import('../chart'))
const ClanDetials = d(() => import('../clandetails'))

export default function List(props) {
  const [state, setState] = useState({
    ...props,
    iconsLocation: {},
    iconsPicture: '',
    imgSize: {
      height: 0,
      width: 0,
      oneItem: 0
    },
    isFetchingData: false,
    haveAllClans: false
  })
  const [sortOn, setSortOn] = useState('')
  const [searchQuery, setSearchQuery] = useState(undefined)

  return (
    <div className="list">
      <ListHeader
        setSortOn={setSortOn}
        sortOn={sortOn}
        setSearchQuery={setSearchQuery}
      />
      <div className="actualData">
        <GetData
          sortOn={sortOn}
          setSortOn={setSortOn}
          searchQuery={searchQuery}
          state={state}
          setState={setState}
        />
        {state.isFetchingData ?
          <div className="loading">loading...</div>
          : ''}
        {state.haveAllClans ?
          <div className="loading">End of the list :(</div>
          : ''}
      </div>
      { !props.isMobile
        ? <div className="chartAndStats">
          <Chart
            type="light"
          />
          <ClanDetials
            showClan={props.showClan}
            isMobile={props.isMobile}
          />
        </div>
        : ''}
    </div>
  )
}
