import React from 'react'
import n from '../funs/networking'

export default class Comunity extends React.Component {
  constructor(props) {
    super()
    this.state = {
      canShow: false,
      inviteLink: undefined,
      hasError: false
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
  render() {
    return (
      <div className="comunity">
        <h2>Comunity</h2>
        <p className="about">
          Here will be tools, websites, forums, etc for the dutch and belguim World Of Tanks comunity
        </p>
        <div className="floatingElements">
          {/* <div className="floating discordBot">
            <div className="back">
              <h1>BOT</h1>
            </div>
            <div className="frond">
              <p>Add the <span>Discord bot</span> to your server</p>
              <div className="btns">
                <a>Add to your server</a>
              </div>
            </div>
          </div>
          <div className="floating discordServer">
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
          <div className="floating facebookComunity">
            <div className="back">
              <h2>FACE<br/>BOOK</h2>
            </div>
            <div className="frond">
              <p>Join the WOT NL/BE clans <span>Facebook comunity</span></p>
              <div className="btns">
                <a 
                  href="https://www.facebook.com/groups/wotbelgium/" 
                  rel="noopener noreferrer" 
                  target="_blank"
                >Go To</a>
              </div>
            </div>
          </div>
        </div>
        <h2 className="commingSoon">More comming soon!</h2>
      </div>
    )
  }
}
