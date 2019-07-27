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
      showBlockCreator: true,
      blockCratorBackgroundImage: false,
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
        {WEBPACK_PRODUCTION ?
          <h2 className="commingSoon">More comming soon</h2>
          :
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
                  <div
                    onClick={e => this.setState({ blockCratorBackgroundImage: !this.state.blockCratorBackgroundImage })}
                    className={cn('checkbox', { checked: this.state.blockCratorBackgroundImage })}
                  >
                    <div className="check"></div>
                  </div>
                </div>
                {this.state.blockCratorBackgroundImage ?
                  <React.Fragment>
                    <div className="input">
                      <label htmlFor="background-url">Backgorund image url:</label>
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
                  <label htmlFor="info">Info <i>(in <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">markdown</a>)</i></label>
                  <textarea
                    id="info"
                    value={bcd.info}
                    onChange={e => this.setState({ blockCreatorData: Object.assign({}, bcd, { info: e.target.value }) })}>
                  </textarea>
                </div>
              </div>
              <div className="side preview">
                <CommunityBlock data={bcd} />
              </div>
            </div>
          </React.Fragment>
        }
      </div>
    )
  }
}
