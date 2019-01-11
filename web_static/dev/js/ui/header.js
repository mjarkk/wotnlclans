import React from 'react'
import cn from 'classnames'
import Button from '../els/button'
import ClanDetials from './clandetails'

export default class Header extends React.Component {
  constructor(props) {
    super()
    this.state = {
      selector: [
        {
          name: 'List',
          onClick: () => this.clickedListLink()
        }
      ],
      current: 0,
      promoHidden: false
    }
    this.addedAdminLink = false
    this.watchScroll()
  }
  componentDidUpdate() {
    if (this.addedAdminLink) {
      if (!this.props.user.logedIn || this.props.user.rights != 'admin') {
        this.addedAdminLink = false
        const currentSelector = this.state.selector
        const toRemove = currentSelector.reduce((acc, curr) => curr.name == 'Admin' ? curr : acc, undefined)
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
          name: 'Admin',
          onClick: () => this.clickedAdminLink()
        })
        this.setState({
          selector: currentSelector
        })
      }
    }
  }
  clickedAdminLink() {

  }
  clickedListLink() {

  }
  watchScroll() {
    const body = document.querySelector('body')
    body.onscroll = () => {
      const out = document.documentElement.scrollTop > 10
      if (this.state.promoHidden != out) {
        this.setState({
          promoHidden: out
        })
      }
    }
  }
  render() {
    return (
      <div className="header">
        <div className="top">
          <div className="links"> 
            {this.state.selector.map((select, id) => 
                <h2 
                  key={id} 
                  className={cn({selected: this.state.current == id})} 
                  onClick={() => {
                    this.setState({
                      current: id
                    })
                    select.onClick()
                  }}
                >{ select.name }</h2>  
            )}
          </div>
          <div className="itemOptions">
            <Button title={this.props.user.logedIn ? 'Logout' : 'Login'} click={() =>
              this.props.user.logedIn 
                ? this.props.logoutClicked() 
                : this.props.loginClicked()
            }/>
          </div>
        </div>
        <div className={cn('promo', {hidden: this.state.promoHidden})}>
          <div className="promoInner">
            <h1>Wot NL/BE clans</h1>
          </div>
        </div>
        { this.props.isMobile
          ? <div className={cn('clanStatsContainer', {show: this.props.showClan})}>
              <ClanDetials showClan={this.props.showClan} isMobile={this.props.isMobile} />
            </div>
        : ''}
      </div>
    )
  }
}
