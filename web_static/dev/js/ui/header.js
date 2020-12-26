import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import d from '@loadable/component'

const ClanDetials = d(() => import('./clandetails'))

export default function Header({ currentPage, isMobile, showClan }) {
  const go_to = (url) => {
    location.hash = url
  }

  const watchScroll = () => {
    window.addEventListener('scroll', () => {
      const out = document.documentElement.scrollTop > 10
      if (state.promoHidden != out) {
        setState({
          ...state,
          promoHidden: out
        })
      }
    })
  }

  const [state, setState] = useState({
    selector: [
      {
        selectedWhen: 'list',
        name: 'List',
        color: 'blue',
        onClick: () => go_to('/')
      },
      ...(CONF_COMMUNITY ? [
        {
          selectedWhen: 'community',
          name: 'Community',
          color: 'green',
          onClick: () => go_to('/community'),
        }
      ] : [])
    ],
    promoHidden: false,
    currentPage: 'list'
  })

  useEffect(() => {
    watchScroll()
  }, [])

  useEffect(() => {
    if (state.currentPage != currentPage) {
      setState({
        ...state,
        currentPage: currentPage
      })
    }
  }, [currentPage])

  return (
    <div className={cn('header', { 'showNoLinks': state.selector.length <= 1 })}>
      <div className="top">
        <div
          className="fullscreenCenter"
          style={{
            minWidth: `${(state.selector.length) * 160}px`,
            maxWidth: `${(state.selector.length) * 160}px`
          }}
        >
          {state.selector.map((select, id) =>
            <button
              key={id}
              className={cn(
                select.color,
                {
                  selected: state.currentPage == select.selectedWhen
                }
              )}
              onClick={() => {
                setState({
                  ...state,
                  currentPage: select.selectedWhen
                })
                select.onClick()
              }}
            >{select.name}</button>
          )}
        </div>
      </div>
      <div className={cn('promo', { hidden: state.promoHidden })}>
        <div className={cn('promoInner', { 'noSponsor': !CONF_SPONSOR })}>
          <h1>{CONF_TITLE}</h1>
          {CONF_SPONSOR
            ? <p>{CONF_SPONSOR.pre} {CONF_SPONSOR.linkURL && CONF_SPONSOR.linkText ? <a href={CONF_SPONSOR.linkURL}>{CONF_SPONSOR.linkText}</a> : ''}</p>
            : ''
          }
        </div>
      </div>
      {
        isMobile && state.currentPage == 'list'
          ? <div className={cn('clanStatsContainer', { show: showClan })}>
            <ClanDetials showClan={showClan} isMobile={isMobile} />
          </div>
          : ''
      }
    </div >
  )
}
