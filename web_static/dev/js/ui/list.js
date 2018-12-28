import React from 'react'
import network from '../funs/networking'
import funs from '../funs/functions'

export default class List extends React.Component {
  constructor() {
    super()
    this.state = {
      list: {},
      iconsLocation: {},
      iconsPicture: '',
    }
    this.getNeededInfo()
  }
  async getNeededInfo() {
    const list = await network.getClanList()
    const iconsLocation = funs.clanIconsToIndex(await network.getIconsLocation())
    const iconsPicture = await network.getIconsPicture()
    this.setState({
      list,
      iconsLocation,
      iconsPicture
    }, () => {
      console.log(this.state)
    })
  }
  render() {
    return(
      <div className="list">
        <h1>List</h1>
        <div className="filterRow"></div>
        <div className="actualData">
          { 
            Object.keys(this.state.list).length != 0
            ? Object.keys(this.state.list).map(id => {
                const item = this.state.list[id]
                console.log(item)
                return (<div key={id} className="row">
                  <div className="icon"></div>
                  <div className="data">
                    <div className="row row1">
                      <div className="tag">{item.tag}</div>
                      <div className="rating"></div>
                    </div>
                    <div className="row row2">
                      <div></div>
                    </div>
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
