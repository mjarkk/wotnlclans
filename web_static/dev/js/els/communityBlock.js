import React, { useState, Fragment } from 'react'
import d from '@loadable/component'
import snarkdown from 'snarkdown'

const SVG = d(() => import('./svg'))

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

export default function CommunityBlock({ data }) {
  const [showInfo, setShowInfo] = useState(false)

  if (!data) {
    return (<></>);
  }

  return (
    <>
      {/* The block */}
      <div className="floating" style={!data.background.image ? { backgroundColor: data.background.color } : { backgroundImage: `url(${data.background.image})` }}>
        <div className="back">
          {!data.background.text || data.background.image ? '' : data.background.text.split('\n').length <= 1
            ? <h1>{data.background.text.split('\n').map((item, key) => <Fragment key={key}>{item}<br /></Fragment>)}</h1>
            : <h2>{data.background.text.split('\n').map((item, key) => <Fragment key={key}>{item}<br /></Fragment>)}</h2>
          }
        </div>
        <div className="frond">
          <p>{data.text.split('\n').map((item, key) => <Fragment key={key}>{item}<br /></Fragment>)}</p>
          <div className="btns">
            <a
              href={data.link.url}
              rel="noopener noreferrer"
              target="_blank"
            >{data.link.text || 'Link'}</a>
            {data.info.length > 0 ?
              <div className="infoBtn" onClick={() => setShowInfo(true)}>
                <SVG icon="filledInfo" />
              </div>
              : ''}
          </div>
        </div>
      </div>

      {/* The info popup */}
      {showInfo ?
        <div
          className="fullscreen"
          onClick={e => {
            if (e.currentTarget == e.target) {
              setShowInfo(false)
            }
          }}
        >
          <div className="center">
            <div
              className="titlebar"
              onClick={() => setShowInfo(false)}
            >
              <SVG icon="close" />
              <p>Back</p>
            </div>
            <div className="markdownPart" dangerouslySetInnerHTML={{ __html: snarkdown(data.info) }}></div>
          </div>
        </div>
        : ''}
    </>
  )
}
