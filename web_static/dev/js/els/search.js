import React from 'react'
import SVG from './svg'

export default class Search extends React.Component {
  constructor(props) {
    super()
    this.state = {
      input: ''
    }
    this.input = undefined
  }
  render() {
    return (
      <div className="inputWrapper">
        <input
          ref={element => this.input = element}
          onChange={e => {
            const value = e.target.value
            this.setState({ input: value })
            if (this.props.onChange) {
              this.props.onChange(value)
            }
          }}
          placeholder={this.props.placeholder || ''}
        />
        {typeof this.props.showIcon == 'undefined' || this.props.showIcon ?
          <div
            className="isvg"
            onClick={() => {
              this.input.focus()
            }}
          >
            <SVG icon="search" />
          </div>
          : ''}
      </div>
    )
  }
}
