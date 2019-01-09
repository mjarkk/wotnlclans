import React from 'react'
import ReactDOM  from 'react-dom'
import List from './ui/list'
import Header from './ui/header'
import Login from './ui/login'
import f from './funs/functions'
import n from './funs/networking'
import r from './funs/routes'
import '../style/index.styl'

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
        key: ''
      }
    }
  }
  componentDidMount() {
    const key = localStorage.getItem('wotnlclans-api-key')
    const userID = localStorage.getItem('wotnlclans-api-userid')
    if (key && userID) {
      n.checkKey(key, userID)
        .then(status => {
          if (status) {
            this.setState({
              user: {
                logedIn: true,
                userID,
                key
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
                key: data.key
              }
            })
            if (data.status == 'true') {
              localStorage.setItem('wotnlclans-api-key', data.key)
              localStorage.setItem('wotnlclans-api-userid', data.userID)
            }
          }}
        />
        <Header
          isMobile={this.state.isMobile} 
          showClan={this.state.showClan}
          setShowClan={showClan => this.setState({showClan})}
          loginClicked={() => this.setState({showLogin: true})
          }
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
