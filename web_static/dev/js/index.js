import React from 'react'
import ReactDOM  from 'react-dom'
import List from './ui/list'
import Header from './ui/header'
import Login from './ui/login'
import '../style/index.styl'

class Site extends React.Component {
  constructor() {
    super()
    this.state = {
      pages: {
        list: {
          el: <List/>
        }
      },
      currentPage: 'list',
      showLogin: false,
    }
  }
  render() {
    return(
      <div className="root">
        <Login show={this.state.showLogin} hideMe={() => this.setState({showLogin: false})}/>
        <Header loginClicked={() => this.setState({
          showLogin: true
        })}/>
        {this.state.pages[this.state.currentPage].el}
      </div>
    )
  }
}

ReactDOM.render(<Site />, document.getElementById('root'))
