import React from 'react'
import snarkdown from 'snarkdown'
import { discordBot } from '../funs/texts'
import n from '../funs/networking'
import d from '../funs/dynamic'

const SVG = d(import('../els/svg'))

export default class Comunity extends React.Component {
  constructor(props) {
    super()
    this.state = {
      canShow: false,
      inviteLink: undefined,
      hasError: false,
      showInfo: false,
      blocks: [],
    }
  }
  async componentDidMount() {
    n.fetchWCache('/discord', false)
      .then(out => {
        if (out.status) {
          this.setState({
            inviteLink: out.inviteLink
          })
        } else {
          this.setState({
            hasError: true
          })
        }
      })
    n.fetchWCache('/community')
      .then(out => {
        this.setState({ blocks: out.data })
      })
  }
  showPopup(markDownToShow) {
    return (markDownToShow ?
      <div
        className="fullscreen"
        onClick={e => {
          if (e.currentTarget == e.target) {
            this.setState({ showInfo: false })
          }
        }}
      >
        <div className="center">
          <div
            className="titlebar"
            onClick={() => this.setState({ showInfo: false })}
          >
            <SVG icon="close" />
            <p>Back</p>
          </div>
          <div className="markdownPart" dangerouslySetInnerHTML={{ __html: snarkdown(markDownToShow) }}></div>
        </div>
      </div>
      : '')
  }
  render() {
    return (
      <div className="community">
        <h2>community</h2>
        <p className="about">
          Here will be tools, websites, forums, etc for the Dutch and Belgium World Of Tanks community
        </p>
        <div className="floatingElements">
          {this.state.blocks.map((block, id) =>
            <div className="floating" key={id} style={{ backgroundColor: block.background.color }}>
              <div className="back">
                <h2>{block.background.text.split('\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}</h2>
              </div>
              <div className="frond">
                <p>{block.text.split('\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}</p>
                <div className="btns">
                  <a
                    href={block.link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >{block.link.text || 'Link'}</a>
                </div>
              </div>
            </div>
          )}
          <div className="floating facebookCommunity">
            <div className="back">
              <h2>FACE<br />BOOK</h2>
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
                  <div className="infoBtn" onClick={() => this.setState({ showInfo: discordBot })}>
                    <SVG icon="filledInfo" />
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
