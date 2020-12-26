import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import d from '@loadable/component'
import n from '../funs/networking'

const Icon = d(() => import('../els/svg'))

export default function ClanDetials({ showClan }) {
  const [icon, setIcon] = useState('')
  const [clan, setClan] = useState(undefined);
  const [description, setDescription] = useState('');

  const getIcon = emblems => (emblems.x195_portal || emblems.x64_portal || '').replace(/http(s)?/, 'https')

  useEffect(() => {
    if (clan?.tag != showClan?.tag) {
      setClan(showClan)
      if (showClan) {
        setIcon(getIcon(showClan.emblems))
        n.getDescription(showClan.id).then(description => setDescription(description))
      }
    }
  }, [showClan])

  const d = clan?.tag
  return (
    <div className={cn('clanDetials', { show: d })}>
      <div className="clanDetialsInner">
        <div className="actionBar">
          <div className="back" onClick={() => location.hash = '/'}>
            <Icon icon="close" />
          </div>
          {d && CONF_SPONSOR?.clanID && clan.id == CONF_SPONSOR?.clanID ?
            <div className="isSponsor">Sponsor!</div>
            : ''}
        </div>
        <div className="icon">
          <img src={icon} />
        </div>
        <h1>{`[${d ? clan.tag : ''}]`}</h1>
        <h3>{d ? clan.name : ''}</h3>
        {d ? RenderStats(clan.stats) : ''}
        <div
          className="discription"
          dangerouslySetInnerHTML={{ __html: d ? description : '' }}
        />
      </div>
    </div>
  )
}

function RenderStats(clan) {
  const list = [
    { type: 'one', item: 'efficiency', name: 'Efficiency' },
    { type: 'one', item: 'glob_rating', name: 'Global' },
    { type: 'one', item: 'glob_rating_weighted', name: 'Global weighted' },
    { type: 'one', item: 'members', name: 'Members' },
    { type: 'one', item: 'battles', name: 'Total battles' },
    { type: 'one', item: 'daily_battles', name: 'Daily battles' },
    { type: 'one', item: 'win_ratio', name: 'Win rate' },
    { type: 'one', item: 'v10l', name: 'v10l' },
    {
      type: 'multiple', items: [
        { item: 'fb_elo10', name: '10' },
        { item: 'fb_elo8', name: '8' },
        { item: 'fb_elo6', name: '6' },
        { item: 'fb_elo', name: '±' }
      ], name: 'fbelo'
    },
    {
      type: 'multiple', items: [
        { item: 'gm_elo10', name: '10' },
        { item: 'gm_elo8', name: '8' },
        { item: 'gm_elo6', name: '6' },
        { item: 'gm_elo', name: '±' }
      ], name: 'global'
    },
  ]

  return (
    <div className="stats">
      {list.map((item, key) =>
        item.type == 'one'
          ? <div key={key} className="block one">
            <div className="propertyName">{item.name}</div>
            <div className="value">{clan[item.item]}</div>
          </div>
          : <div key={key} className="block multiple">
            <div className="propertyName">{item.name}</div>
            <div className="values">
              {item.items.map((el, key, arr) =>
                <div key={key} className={cn('stat', { first: key == 0, last: key == (arr.length - 1) })}>
                  <span className="what">{el.name}:</span>
                  <span className="value">{clan[el.item]}</span>
                </div>
              )}
            </div>
          </div>
      )}
    </div>
  )
}
