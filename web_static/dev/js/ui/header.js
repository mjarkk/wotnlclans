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
          onClick: () => this.clickedListLink()
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
        onClick: () => this.clickedComunityLink()
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
  clickedComunityLink() {
    location.hash = '/community'
  }
  clickedListLink() {
    location.hash = '/'
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
      <div className="header">
        <div className="top">
          <div
            className="fullscreenCenter"
            style={{
              minWidth: `${(this.state.selector.length + 1) * 160}px`,
              maxWidth: `${(this.state.selector.length + 1) * 160}px`
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
          <div className="promoInner">
            <h1>{CONF_BOTTOM_TEXT}</h1>
            <p>{CONF_SPONSOR.pre} <a href={CONF_SPONSOR.linkURL}>{CONF_SPONSOR.linkText}</a></p>
          </div>
        </div>
        { this.props.isMobile && this.props.currentPage == 'list'
          ? <div className={cn('clanStatsContainer', { show: this.props.showClan })}>
            <ClanDetials showClan={this.props.showClan} isMobile={this.props.isMobile} />
          </div>
          : ''}
      </div>
    )
  }
}
