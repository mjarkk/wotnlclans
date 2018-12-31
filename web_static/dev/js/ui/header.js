import React from 'react'
import cn from 'classnames'
import Button from '../els/button'

export default class Header extends React.Component {
  constructor(props) {
    super()
    this.state = Object.assign({
      selector: [
        {
          name: 'List',
          onClick: () => {

          }
        }
      ],
      current: 0,
      promoHidden: false
    }, props)
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
            <Button title={"Settings"} click={() => {
              console.log("Clicked on idk")
            }}/>
            <Button title={'Login'} click={() => {
              this.state.loginClicked()
            }}/>
          </div>
        </div>
        <div className={cn('promo', {hidden: this.state.promoHidden})}>
          <div className="promoInner">
            <h1>Wot NL/BE clans</h1>
          </div>
        </div>
      </div>
    )
  }
}
