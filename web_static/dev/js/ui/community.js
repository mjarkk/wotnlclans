import React from 'react'
import n from '../funs/networking'
import snarkdown from 'snarkdown'
import SVG from '../els/svg'
import {discordBot} from '../funs/texts'

export default class Comunity extends React.Component {
  constructor(props) {
    super()
    this.state = {
      canShow: false,
      inviteLink: undefined,
      hasError: false,
      showInfo: false
    }
  }
  async componentDidMount() {
    const out = await n.fetchWCache('/discord', false)
    if (out.status) {
      this.setState({
        inviteLink: out.inviteLink
      })
    } else {
      this.setState({
        hasError: true
      })
    }
  }
  showPopup(markDownToShow) {
    return (markDownToShow ? 
    <div 
      className="fullscreen"
      onClick={e => {
        if (e.currentTarget == e.target) {
          this.setState({showInfo: false})
        }
      }}
    >
      <div className="center">
        <div 
          className="titlebar"
          onClick={() => this.setState({showInfo: false})}
        >
          <SVG icon="close"/>
          <p>Back</p>
        </div>
        <div className="markdownPart" dangerouslySetInnerHTML={{__html: snarkdown(markDownToShow)}}></div>
      </div>
    </div>
    :'')
  }
  render() {
    return (
      <div className="community">
        <h2>community</h2>
        <p className="about">
          Here will be tools, websites, forums, etc for the dutch and belguim World Of Tanks community
        </p>
        <div className="floatingElements">
          {/* <div className="floating discordServer">
            <div className="back">
              <h2>SERV<br/>ER</h2>
            </div>
            <div className="frond">
              <p>Join the WOT NL/BE clans <span>Discord server</span></p>
              <div className="btns">
                <a>Go To</a>
              </div>
            </div>
          </div> */}
          <div className="floating facebookCommunity">
            <div className="back">
              <h2>FACE<br/>BOOK</h2>
            </div>
            <div className="frond">
              <p>Join the WOT NL/BE clans <span>Facebook community</span></p>
              <div className="btns">
                <a 
                  href="https://www.facebook.com/groups/wotbelgium/" 
                  rel="noopener noreferrer" 
                  target="_blank"
                >Go To</a>
              </div>
            </div>
          </div>
          {this.state.inviteLink && !this.state.hasError ? 
            <div className="floating discordBot">
              <div className="back">
                <h1>BOT</h1>
              </div>
              <div className="frond">
                <p>Add the <span>Discord bot</span> to your server</p>
                <div className="btns">
                  <a
                    href={this.state.inviteLink}
                    rel="noopener noreferrer" 
                    target="_blank"
                  >Add to server</a>
                  <div className="infoBtn" onClick={() => this.setState({showInfo: discordBot})}>
                    <SVG icon="filledInfo"/>
                  </div>
                </div>
              </div>
            </div>
          : ''}
        </div>
        {this.showPopup(this.state.showInfo)}
        <h2 className="commingSoon">More comming soon!</h2>
      </div>
    )
  }
}
