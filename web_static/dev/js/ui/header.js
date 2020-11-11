import React from 'react'
import cn from 'classnames'
import d from '../funs/dynamic'

const ClanDetials = d(import('./clandetails'))

export default class Header extends React.Component {
  constructor(props) {
    super()
    this.state = {
      selector: [
        {
          selectedWhen: 'list',
          name: 'List',
          color: 'blue',
          onClick: () => this.goto('/')
        }
      ],
      promoHidden: false,
      currentPage: 'list'
    }

    if (CONF_COMMUNITY) {
      this.state.selector.push({
        selectedWhen: 'community',
        name: 'Community',
        color: 'green',
        onClick: () => this.goto('/community'),
      })
    }

    this.watchScroll()
  }
  componentDidUpdate() {
    if (this.state.currentPage != this.props.currentPage) {
      this.setState({
        currentPage: this.props.currentPage
      })
    }
  }
  goto(url) {
    location.hash = url
  }
  watchScroll() {
    window.addEventListener('scroll', () => {
      const out = document.documentElement.scrollTop > 10
      if (this.state.promoHidden != out) {
        this.setState({
          promoHidden: out
        })
      }
    })
  }
  render() {
    return (
      <div className={cn('header', { 'showNoLinks': this.state.selector.length <= 1 })}>
        <div className="top">
          <div
            className="fullscreenCenter"
            style={{
              minWidth: `${(this.state.selector.length) * 160}px`,
              maxWidth: `${(this.state.selector.length) * 160}px`
            }}
          >
            {this.state.selector.map((select, id) =>
              <button
                key={id}
                className={cn(
                  select.color,
                  {
                    selected: this.state.currentPage == select.selectedWhen
                  }
                )}
                onClick={() => {
                  this.setState({
                    currentPage: select.selectedWhen
                  })
                  select.onClick()
                }}
              >{select.name}</button>
            )}
          </div>
        </div>
        <div className={cn('promo', { hidden: this.state.promoHidden })}>
          <div className={cn('promoInner', { 'noSponsor': !CONF_SPONSOR })}>
            <h1>{CONF_TITLE}</h1>
            {CONF_SPONSOR
              ? <p>{CONF_SPONSOR.pre} {CONF_SPONSOR.linkURL && CONF_SPONSOR.linkText ? <a href={CONF_SPONSOR.linkURL}>{CONF_SPONSOR.linkText}</a> : ''}</p>
              : ''
            }
          </div>
        </div>
        {
          this.props.isMobile && this.props.currentPage == 'list'
            ? <div className={cn('clanStatsContainer', { show: this.props.showClan })}>
              <ClanDetials showClan={this.props.showClan} isMobile={this.props.isMobile} />
            </div>
            : ''
        }
      </div >
    )
  }
}
