import React from 'react'
import network from '../funs/networking'
import funs from '../funs/functions'
import Icon from '../els/svg'
import ClanDetials from './clandetails'
import Search from '../els/search'

export default class List extends React.Component {
  constructor(props) {
    super()
    this.state = Object.assign({
      list: [],
      iconsLocation: {},
      iconsPicture: '',
      imgSize: {
        height: 0,
        width: 0,
        oneItem: 0
      },
      filter: '',
    }, props)
    this.canSetState = true
    this.getNeededInfo()
  }
  componentDidMount() {
    this.canSetState = true
  }
  componentWillUnmount() {
    this.canSetState = false
  }
  async getNeededInfo() {
    const list = funs.sortList('globalRating', await network.getClanList())
    if (!this.canSetState) {
      return
    }
    this.setState({
      list
    })
    const iconsLocation = funs.clanIconsToIndex(await network.getIconsLocation())
    const iconsPicture = await network.getIconsPicture()
    this.setState({
      iconsLocation,
      iconsPicture
    })
    const img = document.createElement('img')
    img.onload = () => {
      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight
      const maxLocations = Object.keys(iconsLocation).reduce((acc, id) => {
        const item = iconsLocation[id]
        if (item.x > acc.x) {
          acc.x = item.x
        }
        if (item.y > acc.y) {
          acc.y = item.y
        }
        return acc
      }, {x:0, y:0})
      maxLocations.x ++
      maxLocations.y ++
      this.setState({
        imgSize: {
          height: imgHeight,
          width: imgWidth,
          oneItem: imgHeight / maxLocations.y
        }
      })
    }
    img.src = iconsPicture
  }
  render() {
    return(
      <div className="list">
        <div className="title">
          <h2>Topclans</h2>
        </div>
        <div className="filters">
          <Search
            placeholder="Search for clans"
            onChange={filter => this.setState({filter})}
          />
        </div>
        <div className="actualData">
          { 
            this.state.list.length != 0
            ? this.state.list.map((item, id) => {
                const loc = this.state.iconsLocation[item.id]
                return (
                  <div
                    style={{
                      display: 
                        this.state.filter == '' 
                        || item.tag.toUpperCase().indexOf(this.state.filter.toUpperCase()) != -1 
                        || item.name.toUpperCase().indexOf(this.state.filter.toUpperCase()) != -1 
                          ? 'grid'
                          : 'none'
                    }} 
                    key={id}
                    className="row"
                    onClick={() => {
                      location.hash = `/clan/${item.id}`
                    }}
                  >
                    <div className="position">{id + 1}</div>
                    <div className="icon">
                      <div className="holder" style={{
                        backgroundImage: loc ? `url(${this.state.iconsPicture})` : '',
                        backgroundPosition: loc ? `-${loc.x * 60}px -${loc.y * 60}px` : '',
                      }}></div>
                    </div>
                    <div className="tag">[{item.tag}]</div>
                    <div className="rating clanRating">
                      <span>Rating</span>
                      <span>{item.stats.globRatingweighted}</span>
                    </div>
                    <div className="rating winrate">
                      <span>Winrate</span>
                      <span>{item.stats.winratio}%</span>
                    </div>
                    <div className="rating global">
                      <span>Global 8</span>
                      <span>{item.stats.gmelo8}</span>
                    </div>
                    <div className="rating stronghold">
                      <span>Stronghold</span>
                      <span>{item.stats.fbelo}</span>
                    </div>
                    <div className="rating members">
                      <span>Members</span>
                      <span>{item.members}</span>
                    </div>
                    <div className="rating battles">
                      <span>Battles</span>
                      <span>{item.stats.battles}</span>
                    </div>
                    <div className="moreinfo">
                      <Icon icon="arrow"/>
                    </div>
                  </div>
                )
              })
            : <div className="loading">
                loading...
              </div>
          }
        </div>
        { !this.props.isMobile
          ? <div className={'graphAndStats'}>
              <div className="graph">
                Click a clan to get more details
              </div>
              <ClanDetials showClan={this.props.showClan} isMobile={this.props.isMobile} />
            </div>
        : ''}
      </div>
    )
  }
}
