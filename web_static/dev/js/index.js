import React from 'react'
import ReactDOM from 'react-dom'
import d from '@loadable/component'
import List from './ui/list/list'
import f from './funs/functions'
import r from './funs/routes'
import '../style/index.styl'

const Header = d(() => import('./ui/header'))
const Chart = d(() => import('./ui/chart'))
const Community = d(() => import('./ui/community'))

class Site extends React.Component {
  constructor() {
    super()
    this.state = {
      currentPage: 'list',
      isMobile: true,
      showClan: undefined,
    }
  }
  componentDidMount() {
    f.watchScreenSize(isMobile => this.setState({ isMobile }))
    r.init().then(state => {
      this.setState(state.index)
    })
    r.watchHash(state => {
      this.setState(state.index)
    })
  }
  render() {
    return (
      <div className="root">
        <Header
          currentPage={this.state.currentPage}
          isMobile={this.state.isMobile}
          showClan={this.state.showClan}
          setShowClan={showClan => this.setState({ showClan })}
        />
        {
          this.state.currentPage == 'list'
            ? <List
              user={this.state.user}
              isMobile={this.state.isMobile}
              showClan={this.state.showClan}
              setShowClan={showClan => this.setState({ showClan })}
            />
            : this.state.currentPage == 'community'
              ? <Community />
              : this.state.isMobile && this.state.currentPage == 'chart'
                ? <Chart type="dark" />
                : ''
        }
      </div>
    )
  }
}

ReactDOM.render(<Site />, document.getElementById('root'))
