import React from 'react'
import ReactDOM  from 'react-dom'
import List from './ui/list'
import '../style/index.styl'

class Site extends React.Component {
  render() {
    return(
      <div className="root">
        <List/>
      </div>
    )
  }
}

ReactDOM.render(<Site />, document.getElementById('root'))
