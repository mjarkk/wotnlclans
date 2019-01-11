import React from 'react'
import cn from 'classnames'

export default class Button extends React.Component {
  render() {
    return (
      <button className={cn(this.props.style || 'outline', {dark: typeof this.props.dark == 'boolean' ? this.props.dark : true})} onClick={this.props.click}>{this.props.title}</button>
    )
  }
}
