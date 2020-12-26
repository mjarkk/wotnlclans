import React, { useEffect, useState } from 'react'
import n from '../funs/networking'
import d from '@loadable/component'
import cn from 'classnames'
import { CirclePicker } from 'react-color'

const CommunityBlock = d(() => import('../els/communityBlock'))

export default function Comunity() {
  const [state, setState] = useState({
    canShow: false,
    inviteLink: undefined,
    hasError: false,
    showInfo: false,
    showBlockCreator: false,
    blockCreatorFirstFetch: false,
    blockCreatorErrors: [],
  })
  const [block, setBlock] = useState({
    backgroundImage: true,
    text: "Example text",
    background: {
      text: "Text",
      color: "#c73535",
      image: ""
    },
    link: {
      url: "https://www.example.com",
      text: ""
    },
    info: "",
    requirements: [],
  })

  let blockCreatorNewChecking = false
  let blockCreatorNeedReCheck = false

  const endRanValidateBlock = (errors) => {
    setTimeout(() => {
      if (errors) {
        setState({
          ...state,
          blockCreatorErrors: errors
        })
      }
      // Add a small timeout to make this a little bit easier for the server
      if (blockCreatorNeedReCheck) {
        blockCreatorNeedReCheck = false
        validateBlock()
        return
      }
      blockCreatorNewChecking = false
    }, 200)
  }

  const validateBlock = () => {
    if (blockCreatorNewChecking) {
      blockCreatorNeedReCheck = true
      return
    }
    blockCreatorNewChecking = true

    setState(state => {
      fetch('/api/checkCommunityBlock', {
        method: "POST",
        body: JSON.stringify(block),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(out => out.json()).then(data => {
        if (data.status) {
          endRanValidateBlock(data.data.errors)
        } else {
          endRanValidateBlock()
          console.log("Post error:", data.error)
        }
      }).catch(err => {
        console.log("Post error:", err)
        endRanValidateBlock()
      })

      return {
        ...state,
        blockCreatorFirstFetch: true,
        blockCreatorErrors: false,
      }
    })
  }

  useEffect(() => validateBlock(), [block])

  useEffect(() => {
    n.fetchWCache('/api/discord', false).then(out =>
      setState(out.status ? { ...state, inviteLink: out.inviteLink } : { ...state, hasError: true })
    )
  }, [])

  return (
    <div className="community">
      <h2>community</h2>
      <p className="about">Here will be tools, websites, forums, etc for the Dutch and Belgium World Of Tanks community</p>
      <div className="floatingElements">
        {(CONF_COMMUNITY || []).map((block, key) =>
          block.requirements.indexOf('discord') != -1 && !state.inviteLink && !state.hasError && WEBPACK_PRODUCTION
            ? ''
            : <CommunityBlock key={key} data={block} />
        )}
      </div>
      <>
        {state.showBlockCreator ? '' :
          <h2 className="commingSoon" onClick={() => setState({ ...state, showBlockCreator: true })}>Add your block here too..</h2>
        }
        <div className="blockCreator" style={{ display: state.showBlockCreator ? 'flex' : 'none' }}>
          <div className="side data">
            <h3>Values</h3>
            <div className="input">
              <label htmlFor="background-url">Title:</label>
              <input
                id="background-url"
                type="input"
                value={block.text}
                onChange={e => setBlock(b => ({ ...b, text: e.target.value }))} />
            </div>
            <div className="input">
              <label
                onClick={() => setBlock(b => ({ ...b, backgroundImage: !b.backgroundImage }))}
              >Use background image</label>
              <div className="checkboxHolder">
                <button
                  onClick={() => setBlock(b => ({ ...b, backgroundImage: !b.backgroundImage }))}
                  className={cn('checkbox')}
                ></button>
                <div
                  onClick={() => setBlock(b => ({ ...b, backgroundImage: !b.backgroundImage }))}
                  className={cn('check', { checked: block.backgroundImage })}
                ></div>
              </div>
            </div>
            {block.backgroundImage ?
              <>
                <div className="input">
                  <label htmlFor="background-url">Background image url:</label>
                  <input
                    id="background-url"
                    type="input"
                    value={block.background.image}
                    onChange={e => setBlock(b => ({ ...b, background: { ...b.background, image: e.target.value } }))} />
                </div>
              </>
              :
              <>
                <div className="colorPicker">
                  <label>Background color</label>
                  <CirclePicker
                    color={block.background.color}
                    colors={['#c73535', '#ae208d', '#701db6', '#2259a4', '#129188', '#225c07', '#7b7a16', '#a66207', '#393939']}
                    onChangeComplete={e => setBlock(b => ({ ...b, background: { ...b.background, color: e.hex } }))}
                  />
                </div>
                <div className="input">
                  <label htmlFor="background-text">Backgorund text</label>
                  <textarea
                    className="mini"
                    id="background-text"
                    value={block.background.text}
                    onChange={e => {
                      let toSave = e.target.value
                      const splittedToSave = toSave.split('\n')
                      if (splittedToSave.length > 2) {
                        toSave = ([splittedToSave[0], splittedToSave[1]]).join('\n')
                      }
                      setBlock(b => ({ ...b, background: { ...b.background, text: toSave } }))
                    }}>
                  </textarea>
                </div>
              </>
            }
            <div className="input">
              <label htmlFor="info">Info <i>(in <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" rel="noopener noreferrer" target="_blank">markdown</a>)</i></label>
              <textarea
                id="info"
                value={block.info}
                onChange={e => setBlock(b => ({ ...b, info: e.target.value }))}>
              </textarea>
            </div>
            <div className="final">
              {state.blockCreatorFirstFetch ?
                state.blockCreatorErrors === false ?
                  <div className="loading">
                    <h4>Loading...</h4>
                  </div>
                  : state.blockCreatorErrors.length == 0 ?
                    <div className="submit">
                      <h4>Submit the block</h4>
                      <p>From here you can submit the code for the block to DPG</p>
                      <div className="options">
                        <a
                          href={`mailto:info@dpg-hq.eu?subject=${encodeURIComponent('(Wot NL/BE clans) Een kader toevoegen aan community pagina')}&body=${encodeURIComponent('Zou deze kader mogen toegevoegt worden aan de WOT NL/BE clans site?\n\n' + JSON.stringify(block, null, 2) + '\n\nM.V.G.\n...')}`}
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
                        <pre>{JSON.stringify(block, null, 2)}</pre>
                      </div>
                    </div>
                    :
                    <div className="errors">
                      <h4>Errors:</h4>
                      <ul>
                        {state.blockCreatorErrors.map((error, key) => <li key={key}>{error}</li>)}
                      </ul>
                    </div>
                : ''}
            </div>
          </div>
          <div className="side preview">
            <CommunityBlock data={block} />
          </div>
        </div>
      </>
    </div >
  )
}
