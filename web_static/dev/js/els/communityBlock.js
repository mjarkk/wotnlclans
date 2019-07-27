import React from 'react'
import d from '../funs/dynamic'
import snarkdown from 'snarkdown'

const SVG = d(import('./svg'))

/*
<CommunityBlock data={{...}}/>
// For spec of data see: other/other.go > CommunityBlock (type)

// data example:
data = {
  "text": "Join the WOT NL/BE\nclans Facebook community",
  "background": {
    "text": "FACE\nBOOK",
    "color": "#4c4fef",
    "image": ""
  },
  "link": {
    "url": "https://www.facebook.com/groups/wotbelgium/",
    "text": "Go To"
  },
  "info": "",
  "requirements": []
}
*/

export default class CommunityBlock extends React.Component {
  constructor(props) {
    super()
    this.state = {
      showInfo: false
    }
  }
  render() {
    const block = this.props.data
    return (
      <React.Fragment>

        {/* The block */}
        <div className="floating" style={!block.background.image ? { backgroundColor: block.background.color } : { backgroundImage: `url(${block.background.image})` }}>
          <div className="back">
            {!block.background.text || block.background.image ? '' : block.background.text.split('\n').length <= 1
              ? <h1>{block.background.text.split('\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}</h1>
              : <h2>{block.background.text.split('\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}</h2>
            }
          </div>
          <div className="frond">
            <p>{block.text.split('\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}</p>
            <div className="btns">
              <a
                href={block.link.url}
                rel="noopener noreferrer"
                target="_blank"
              >{block.link.text || 'Link'}</a>
              {block.info.length > 0 ?
                <div className="infoBtn" onClick={() => this.setState({ showInfo: true })}>
                  <SVG icon="filledInfo" />
                </div>
                : ''}
            </div>
          </div>
        </div>

        {/* The info popup */}
        {this.state.showInfo ?
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
              <div className="markdownPart" dangerouslySetInnerHTML={{ __html: snarkdown(block.info) }}></div>
            </div>
          </div>
          : ''}
      </React.Fragment>
    )
  }
}
