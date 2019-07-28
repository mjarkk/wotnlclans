import React from 'react'
import n from '../funs/networking'
import d from '../funs/dynamic'
import cn from 'classnames'
import { CirclePicker } from 'react-color'

const CommunityBlock = d(import('../els/communityBlock'))
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
      showBlockCreator: false,
      blockCratorBackgroundImage: true,
      blockCreatorErrors: [],
      blockCreatorFirstFetch: false,
      blockCreatorData: {
        "text": "Example text",
        "background": {
          "text": "Text",
          "color": "#c73535",
          "image": ""
        },
        "link": {
          "url": "https://www.example.com",
          "text": ""
        },
        "info": "",
        "requirements": []
      },
    }
    this.blockCreatorNewChecking = false
    this.blockCreatorNeedReCheck = false
  }
  componentDidUpdate(oldProps, oldState) {
    if (oldState.blockCreatorData == this.state.blockCreatorData) {
      return
    }
    if (this.blockCreatorNewChecking) {
      this.blockCreatorNeedReCheck = true
      return
    }
    this.validateBlock(this.state.blockCreatorData)
  }
  async validateBlock(blockData) {
    this.blockCreatorNewChecking = true
    this.setState({
      blockCreatorFirstFetch: true,
      blockCreatorErrors: false,
    })

    fetch('/api/checkCommunityBlock', {
      method: "POST",
      body: JSON.stringify(blockData),
    }).then(out => out.json()).then(data => {
      if (data.status) {
        this.endRanValidateBlock(blockData, data.data.errors)
      } else {
        this.endRanValidateBlock()
        console.log("Post error:", data.error)
      }
    }).catch(err => {
      console.log("Post error:", err)
      this.endRanValidateBlock()
    })
  }
  endRanValidateBlock(blockData, errors) {
    setTimeout(() => {
      if (blockData && errors) {
        this.setState({
          blockCreatorErrors: errors
        })
      }
      // Add a small timeout to make this a little bit easier for the server
      if (this.blockCreatorNeedReCheck) {
        this.blockCreatorNeedReCheck = false
        this.validateBlock(this.state.blockCreatorData)
        return
      }
      this.blockCreatorNewChecking = false
    }, 200)
  }
  async componentDidMount() {
    n.fetchWCache('/discord', false)
      .then(out =>
        this.setState(out.status ? { inviteLink: out.inviteLink } : { hasError: true })
      )
    n.fetchWCache('/community')
      .then(out =>
        // The status of /community is always true so we don't have to check that
        this.setState({ blocks: out.data })
      )
  }
  render() {
    const bcd = this.state.blockCreatorData // short for "block creator data"
    return (
      <div className="community">
        <h2>community</h2>
        <p className="about">
          Here will be tools, websites, forums, etc for the Dutch and Belgium World Of Tanks community
        </p>
        <div className="floatingElements">
          {this.state.blocks.map((block, key) =>
            block.requirements.indexOf('discord') != -1 && !this.state.inviteLink && !this.state.hasError && WEBPACK_PRODUCTION
              ? ''
              : <CommunityBlock key={key} data={block} />
          )}
        </div>
        <React.Fragment>
          {this.state.showBlockCreator ? '' :
            <h2 className="commingSoon" onClick={() => this.setState({ showBlockCreator: true })}>Add your block here too..</h2>
          }
          <div className="blockCreator" style={{ display: this.state.showBlockCreator ? 'flex' : 'none' }}>
            <div className="side data">
              <h3>Values</h3>
              <div className="input">
                <label htmlFor="background-url">Title:</label>
                <input
                  id="background-url"
                  type="input"
                  value={bcd.text}
                  onChange={e => this.setState({ blockCreatorData: Object.assign({}, bcd, { text: e.target.value }) })} />
              </div>
              <div className="input">
                <label
                  onClick={e => this.setState({ blockCratorBackgroundImage: !this.state.blockCratorBackgroundImage })}
                >Use background image</label>
                <div className="checkboxHolder">
                  <button
                    onClick={e => this.setState({ blockCratorBackgroundImage: !this.state.blockCratorBackgroundImage })}
                    className={cn('checkbox')}
                  ></button>
                  <div
                    onClick={e => this.setState({ blockCratorBackgroundImage: !this.state.blockCratorBackgroundImage })}
                    className={cn('check', { checked: this.state.blockCratorBackgroundImage })}
                  ></div>
                </div>
              </div>
              {this.state.blockCratorBackgroundImage ?
                <React.Fragment>
                  <div className="input">
                    <label htmlFor="background-url">Background image url:</label>
                    <input
                      id="background-url"
                      type="input"
                      value={bcd.background.image}
                      onChange={e => this.setState({ blockCreatorData: Object.assign({}, bcd, { background: Object.assign({}, bcd.background, { image: e.target.value }) }) })} />
                  </div>
                </React.Fragment>
                :
                <React.Fragment>
                  <div className="colorPicker">
                    <label>Background color</label>
                    <CirclePicker
                      color={bcd.background.color}
                      colors={['#c73535', '#ae208d', '#701db6', '#2259a4', '#129188', '#225c07', '#7b7a16', '#a66207', '#393939']}
                      onChangeComplete={e => this.setState({ blockCreatorData: Object.assign({}, bcd, { background: Object.assign({}, bcd.background, { color: e.hex }) }) })}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="background-text">Backgorund text</label>
                    <textarea
                      className="mini"
                      id="background-text"
                      value={bcd.background.text}
                      onChange={e => {
                        let toSave = e.target.value
                        const splittedToSave = toSave.split('\n')
                        if (splittedToSave.length > 2) {
                          toSave = ([splittedToSave[0], splittedToSave[1]]).join('\n')
                        }
                        this.setState({ blockCreatorData: Object.assign({}, bcd, { background: Object.assign({}, bcd.background, { text: toSave }) }) })
                      }}>
                    </textarea>
                  </div>
                </React.Fragment>
              }
              <div className="input">
                <label htmlFor="info">Info <i>(in <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" rel="noopener noreferrer" target="_blank">markdown</a>)</i></label>
                <textarea
                  id="info"
                  value={bcd.info}
                  onChange={e => this.setState({ blockCreatorData: Object.assign({}, bcd, { info: e.target.value }) })}>
                </textarea>
              </div>
              <div className="final">
                {this.state.blockCreatorFirstFetch ?
                  this.state.blockCreatorErrors === false ?
                    <div className="loading">
                      <h4>Loading...</h4>
                    </div>
                    : this.state.blockCreatorErrors.length == 0 ?
                      <div className="submit">
                        <h4>Submit the block</h4>
                        <p>From here you can submit the code for the block to DPG</p>
                        <div className="options">
                          <a
                            href={`mailto:info@dpg-hq.eu?subject=${encodeURIComponent('(Wot NL/BE clans) Een kader toevoegen aan community pagina')}&body=${encodeURIComponent('Zou deze kader mogen toegevoegt worden aan de WOT NL/BE clans site?\n\n' + JSON.stringify(this.state.blockCreatorData, null, 2) + '\n\nM.V.G.\n...')}`}
                            rel="noopener noreferrer" target="_blank" className="option email"
                          >
                            <p>info@dpg-hq.eu</p>
                            <h3>Make email</h3>
                          </a>
                        </div>
                        <div className="manual">
                          <h4>If the email button doesn't work:</h4>
                          <p>Address: <b>info@dpg-hq.eu</b></p>
                          <p>Make sure to include:</p>
                          <pre>{JSON.stringify(this.state.blockCreatorData, null, 2)}</pre>
                        </div>
                      </div>
                      :
                      <div className="errors">
                        <h4>Errors:</h4>
                        <ul>
                          {this.state.blockCreatorErrors.map((error, key) => <li key={key}>{error}</li>)}
                        </ul>
                      </div>
                  : ''}
              </div>
            </div>
            <div className="side preview">
              <CommunityBlock data={bcd} />
            </div>
          </div>
        </React.Fragment>
      </div>
    )
  }
}
