import React from 'react'
import cn from 'classnames'

export default class Button extends React.Component {
  constructor(props) {
    super()
    this.state = Object.assign({
      dark: true,
      title: '',
      style: 'outline'
    }, props)
  }
  render() {
    return (
      <button className={cn(this.state.style, {dark: this.state.dark})} onClick={this.state.click}>{this.state.title}</button>
    )
  }
}
