import React from 'react'
import ReactDOM  from 'react-dom'
import List from './ui/list'
import Header from './ui/header'
import Login from './ui/login'
import Settings from './ui/settings'
import f from './funs/functions'
import n from './funs/networking'
import r from './funs/routes'
import '../style/index.styl'
import Comunity from './ui/comunity'

class Site extends React.Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'list',
      showLogin: false,
      isMobile: true,
      showClan: undefined,
      user: {
        logedIn: false,
        userID: '',
        key: '',
        rights: 'user',
      }
    }
  }
  componentDidMount() {
    const key = localStorage.getItem('wotnlclans-api-key')
    const userID = localStorage.getItem('wotnlclans-api-userid')
    if (key && userID) {
      n.checkKey(key, userID)
        .then(output => {
          if (output && output.status) {
            this.setState({
              user: {
                rights: output.rights,
                logedIn: true,
                userID,
                key,
              }
            })
          }
        })
        .catch(err => {
          console.log('Can\'t fetch information login status, error:', err)
        })
    }
    f.watchScreenSize(isMobile => this.setState({isMobile}))
    r.init().then(state => {
      this.setState(state.index)
    })
    r.watchHash(state => {
      this.setState(state.index)
    })
  }
  render() {
    return(
      <div className="root">
        <Login 
          show={this.state.showLogin} 
          hideMe={data => {
            this.setState({
              showLogin: false,
              user: {
                logedIn: data.status == 'true',
                userID: data.userID,
                key: data.key,
                rights: data.rights
              }
            })
            if (data.status == 'true') {
              localStorage.setItem('wotnlclans-api-key', data.key)
              localStorage.setItem('wotnlclans-api-userid', data.userID)
            }
          }}
        />
        <Header
          currentPage={this.state.currentPage}
          isMobile={this.state.isMobile} 
          showClan={this.state.showClan}
          setShowClan={showClan => this.setState({showClan})}
          loginClicked={() => this.setState({showLogin: true})}
          logoutClicked={() => {
            localStorage.removeItem('wotnlclans-api-key')
            localStorage.removeItem('wotnlclans-api-userid')
            this.setState({
              user: {
                logedIn: false,
                userID: '',
                key: ''
              }
            })
          }}
          user={this.state.user}
        />
        {
          this.state.currentPage == 'list'
          ? <List
              user={this.state.user}
              isMobile={this.state.isMobile} 
              showClan={this.state.showClan}
              setShowClan={showClan => this.setState({showClan})}
            />
          : this.state.currentPage == 'settings'
          ? <Settings
              user={this.state.user}
            />
          : this.state.currentPage == 'comunity' 
          ? <Comunity
              
            />
          :''
        }
      </div>
    )
  }
}

ReactDOM.render(<Site />, document.getElementById('root'))
