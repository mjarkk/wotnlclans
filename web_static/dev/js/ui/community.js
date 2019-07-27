import React from 'react'
import n from '../funs/networking'
import d from '../funs/dynamic'
import CommunityBlock from '../els/communityBlock'

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
        <h2 className="commingSoon">More comming soon!</h2>
      </div>
    )
  }
}
