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
        },{
          selectedWhen: 'community',
          name: 'Community',
          color: 'green',
          onClick: () => this.clickedComunityLink()
        }
      ],
      promoHidden: false,
      currentPage: 'list'
    }
    this.addedAdminLink = false
    this.watchScroll()
  }
  componentDidUpdate() {
    if (this.addedAdminLink) {
      if (!this.props.user.logedIn || this.props.user.rights != 'admin') {
        this.addedAdminLink = false
        const currentSelector = this.state.selector
        const toRemove = currentSelector.reduce((acc, curr, id) => curr.name == 'Admin' ? id : acc, undefined)
        if (toRemove) {
          currentSelector.splice(toRemove, 1)
        }
        this.setState({
          selector: currentSelector
        })
      }
    } else {
      if (this.props.user.logedIn && this.props.user.rights == 'admin') {
        this.addedAdminLink = true
        const currentSelector = this.state.selector
        currentSelector.push({
          selectedWhen: 'settings',
          name: 'Admin',
          color: 'red',
          onClick: () => this.clickedAdminLink(),
        })
        this.setState({
          selector: currentSelector
        })
      }
    }
    if (this.state.currentPage != this.props.currentPage) {
      this.setState({
        currentPage: this.props.currentPage
      })
    }
  }
  clickedAdminLink() {
    location.hash = '/settings'
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
            <button 
              className="yellow"
              onClick={() =>
                this.props.user.logedIn 
                  ? this.props.logoutClicked() 
                  : this.props.loginClicked()
              }
            >{this.props.user.logedIn ? 'Logout' : 'Login'}</button>
          </div>
        </div>
        <div className={cn('promo', {hidden: this.state.promoHidden})}>
          <div className="promoInner">
            <h1>Wot NL/BE clans</h1>
            <p>This side is made possible by <a href="https://www.dpg-hq.eu/">DPG</a> (clan)</p>
          </div>
        </div>
        { this.props.isMobile && this.props.currentPage == 'list'
          ? <div className={cn('clanStatsContainer', {show: this.props.showClan})}>
              <ClanDetials showClan={this.props.showClan} isMobile={this.props.isMobile} />
            </div>
        : ''}
      </div>
    )
  }
}
