import React from 'react'
import ReactDOM  from 'react-dom'
import List from './ui/list'
import Header from './ui/header'
import Login from './ui/login'
import f from './funs/functions'
import r from './funs/routes'
import '../style/index.styl'

class Site extends React.Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'list',
      showLogin: false,
      isMobile: true,
      showClan: undefined
    }
  }
  componentDidMount() {
    f.watchScreenSize(isMobile => this.setState({isMobile}))
    r.init().then(state => {
      this.setState(state.index)
    })
  }
  render() {
    return(
      <div className="root">
        <Login 
          show={this.state.showLogin} 
          hideMe={() => this.setState({showLogin: false})}
        />
        <Header
          isMobile={this.state.isMobile} 
          showClan={this.state.showClan}
          setShowClan={showClan => this.setState({showClan})}
          loginClicked={() => this.setState({
            showLogin: true
          })}
        />
        {
          this.state.currentPage == 'list'
          ? <List 
              isMobile={this.state.isMobile} 
              showClan={this.state.showClan}
              setShowClan={showClan => this.setState({showClan})}
            />
          : ''      
        }
      </div>
    )
  }
}

ReactDOM.render(<Site />, document.getElementById('root'))
