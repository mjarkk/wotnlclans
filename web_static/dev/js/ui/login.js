import React from 'react'
import cn from 'classnames'

export default class Login extends React.Component {
  constructor(props) {
    super()
    this.state = Object.assign({}, {
      show: false
    }, props)
    this.win = undefined
  }
  openPopup() {
    this.win = open(
      location.origin + '/redirectToLogin/' + encodeURIComponent(encodeURIComponent(location.origin)),
      'wotnlclansLogin',
      'toolbar=no,scrollbars=no,width=800,height=600,top=70,left=70'
    )
    window.closeLoginPopup = (key, userID, status, cb) => this.waitForPopupClose(key, userID, status, cb)
    this.watchClose()
  }
  watchClose() {
    if (!this.state.show) {
      return
    } else if (!this.win.closed) {
      setTimeout(() => {
        this.watchClose()
      }, 500)
    } else {
      this.win.close()
      this.state.hideMe(false)
    }
  }
  waitForPopupClose(key, userID, status, cb) {
    const data = {
      key,
      userID,
      status
    }
    cb()
    this.props.hideMe(data)
  }
  componentDidUpdate() {
    if (this.props.show != this.state.show) {
      this.setState({
        show: this.props.show
      })
    }
    if (this.props.show) {
      this.openPopup()
    }
  }
  render() {
    return (
      <div className={cn('login', {show: this.state.show})}>
        <div className="contents">
          <h1>Waiting for login</h1>
        </div>
      </div>
    )
  }
}
