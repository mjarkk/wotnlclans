import React from 'react'

export default class ClanDetials extends React.Component {
  constructor(props) {
    super()
    this.state = {}
  }
  renderStats() {
    const list = [
      {type: 'one', item: 'members', name: 'Members'},
      {type: 'one', item: 'battles', name: 'Total battles'},
      {type: 'one',item: 'dailybattles', name: 'Daily battles'},
      {type: 'one',item: 'winratio', name: 'Win rate'},
      {type: 'one',item: 'v10l', name: 'v10l'},
      {type: 'one',item: 'efficiency', name: 'Efficiency'},
      {type: 'multiple', items: [
        {item: 'fbelo10', name: '10'},
        {item: 'fbelo8', name: '8'},
        {item: 'fbelo6', name: '6'},
        {item: 'fbelo', name: '±'}
      ], name: 'fbelo'},
      {type: 'multiple', items: [
        {item: 'gmelo10', name: '10'},
        {item: 'gmelo8', name: '8'},
        {item: 'gmelo6', name: '6'},
        {item: 'gmelo', name: '±'}
      ], name: 'global'},
    ]
    
    return (
      <div className="stats">
        {list.map((item, key) => 
          <div key={key} className="block">
            {item.name}
          </div>
        )}
      </div>
    )
  }
  render() {
    const d = this.props.showClan && this.props.showClan.tag
    return (
      <div className="clanDetials">
        <div className="clanDetialsInner">
          <pre>{JSON.stringify(this.props.showClan, null, 2)}</pre>
          <div className="icon">
            <img src={d ? this.props.showClan.emblems['X195.Portal'] || this.props.showClan.emblems['X64.Portal'] : ''} />
          </div>
          <h1>{`[${d ? this.props.showClan.tag : ''}]`}</h1>
          <h3>{d ? this.props.showClan.name : ''}</h3>
          {d ? this.renderStats(this.props.showClan.stats) : ''}
          <div 
            className="Discription" 
            dangerouslySetInnerHTML={{__html: d ? this.props.showClan.description : ''}} 
          />
        </div>
      </div>
    )
  }
}
