import React from 'react'
import SVG from './svg'

export default class Search extends React.Component {
  constructor(props) {
    super()
    this.state = {
      input: ''
    }
    this.input = React.createRef()
  }
  render() {
    return (
      <div className="inputWrapper">
        <input
          ref={this.input}
          onChange={e => {
            const value = e.target.value
            this.setState({input: value})
            if (this.props.onChange) {
              this.props.onChange(value)
            }
          }}
          placeholder={this.props.placeholder || ''}
        />
        { typeof this.props.showIcon == 'undefined' || this.props.showIcon
          ? <div className="isvg"
              onClick={() => {
                this.input.current.focus()
              }}
            >
              <SVG icon="search"/>
            </div>
          : ''
        }
      </div>
    )
  }
}
