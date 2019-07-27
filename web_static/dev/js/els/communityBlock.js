import React from 'react'

/*
<CommunityBlock data={{...}}/>

// For spec of data see: other/other.go > CommunityBlock (type)
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
  render() {
    const block = this.props.data
    return (
      <div className="floating" style={{ backgroundColor: block.background.color }}>
        <div className="back">
          {block.background.text.split('\n').length <= 1
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
          </div>
        </div>
      </div>
    )
  }
}
