import React from 'react'
import cn from 'classnames'
import paper from 'paper/dist/paper-core'

export default class Chart extends React.Component {
  constructor(props) {
    super()
    this.state = {}
  }
  componentDidUpdate(prevProps) {
    
  }
  render() {
    return (
      <div className="chart">
        <div className="header">

        </div>
        <div className="actualChart">

        </div>
      </div>
    )
  }
}
