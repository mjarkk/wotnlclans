import React from 'react'
import network from '../funs/networking'
import funs from '../funs/functions'

export default class List extends React.Component {
  constructor() {
    super()
    this.state = {
      list: [],
      iconsLocation: {},
      iconsPicture: '',
      imgSize: {
        height: 0,
        width: 0,
        oneItem: 0
      }
    }
    this.getNeededInfo()
  }
  async getNeededInfo() {
    const list = funs.sortList('stats.globRatingweighted', await network.getClanList())
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
        <h1>List</h1>
        <div className="filterRow"></div>
        <div className="actualData">
          { 
            this.state.list.length != 0
            ? this.state.list.map((item, id) => {
                const location = this.state.iconsLocation[item.id]
                console.log(this.state.imgSize)
                return (<div key={id} className="row">
                  <div className="icon">
                    <div className="holder" style={{
                      backgroundImage: `url(${this.state.iconsPicture})`,
                      backgroundPosition: location ? `${location.x * 30}px ${location.y * 30}px` : '',
                      backgroundSize: `${this.state.imgSize.width/2}px ${this.state.imgSize.height/2}px`
                    }}></div>
                  </div>
                  <div className="data">
                    <div className="rating tag">[{item.tag}]</div>
                    <div className="rating rating"><span>Rating</span>{item.stats.globRatingweighted}</div>
                    <div className="rating winrate"><span>Winrate</span>{item.stats.winratio}%</div>
                    <div className="rating global"><span>Global 8</span>{item.stats.gmelo8}</div>
                    <div className="rating stronghold"><span>Stronghold</span>{item.stats.fbelo}</div>
                    <div className="rating members"><span>Members</span>{item.members}</div>
                    <div className="rating battles"><span>Battles</span>{item.stats.battles}</div>
                  </div>
                </div>)
              })
            : <div className="loading">
              loading...
              </div>
          }
        </div>
      </div>
    )
  }
}
