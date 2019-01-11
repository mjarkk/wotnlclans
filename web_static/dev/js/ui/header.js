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
          onClick: () => {

          }
        }
      ],
      current: 0,
      promoHidden: false
    }
    this.watchScroll()
  }
  watchScroll() {
    const body = document.querySelector('body')
    body.onscroll = e => {
      this.setState({
        promoHidden: document.documentElement.scrollTop > 10
      })
    }
  }
  render() {
    return (
      <div className="header">
        <div className="top">
          <div className="links"> 
            {this.state.selector.map((select, id) => 
                <h2 key={id} className={this.state.current == id ? 'selected' : ''} onClick={select.onClick}>{ select.name }</h2>  
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
