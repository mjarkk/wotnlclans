import React from 'react'
import cn from 'classnames'
import Icon from '../els/svg'

export default class ClanDetials extends React.Component {
  constructor(props) {
    super()
    this.state = {
      showIcon: props.showClan && props.showClan.emblems ? this.getIcon(props.showClan.emblems) : '',
      showClan: props.showClan,
    }
  }
  renderStats(clan) {
    const list = [
      {type: 'one',item: 'efficiency', name: 'Efficiency'},
      {type: 'one', item: 'globrating', name: 'Global'},
      {type: 'one', item: 'globRatingweighted', name: 'Global weighted'},
      {type: 'one', item: 'members', name: 'Members'},
      {type: 'one', item: 'battles', name: 'Total battles'},
      {type: 'one',item: 'dailybattles', name: 'Daily battles'},
      {type: 'one',item: 'winratio', name: 'Win rate'},
      {type: 'one',item: 'v10l', name: 'v10l'},
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
          item.type == 'one' 
          ? <div key={key} className="block one">
              <div className="propertyName">{item.name}</div>
              <div className="value">{clan[item.item]}</div>
            </div>
          : <div key={key} className="block multiple">
              <div className="propertyName">{item.name}</div>
              <div className="values">
                { item.items.map((el, key, arr) => 
                  <div key={key} className={cn('stat', {first: key == 0, last: key == (arr.length - 1)})}>
                    <span className="what">{ el.name }:</span>
                    <span className="value">{ clan[el.item] }</span>
                  </div>
                )}
              </div>
            </div>
        )}
      </div>
    )
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.showClan && this.props.showClan || (prevProps.showClan && this.props.showClan && prevProps.showClan.tag != this.props.showClan.tag)) {
      this.setState({
        showIcon: '',
        showClan: this.props.showClan || this.state.showClan
      }, () => this.setState({
        showIcon: this.props.showClan 
          ? this.getIcon(this.props.showClan.emblems)
          : this.state.showIcon
      }))
    }
  }
  getIcon(emblems) {
    return (emblems['X195.Portal'] || emblems['X64.Portal'] || '').replace(/http(s)?/, 'https')
  }
  render() {
    const d = this.state.showClan && this.state.showClan.tag
    return (
      <div className={cn('clanDetials', {show: this.props.showClan && this.props.showClan.tag})}>
        <div className="clanDetialsInner">
          <div className="actionBar">
            <div className="back" onClick={() => location.hash = '/'}>
              <Icon icon="close"/>
            </div>
            { d && this.state.showClan.id == '500059739' ?
              <div className="isSponsor">Sponsor!</div>
            : ''}
          </div>
          <div className="icon">
            <img src={this.state.showIcon} />
          </div>
          <h1>{`[${d ? this.state.showClan.tag : ''}]`}</h1>
          <h3>{d ? this.state.showClan.name : ''}</h3>
          {d ? this.renderStats(this.state.showClan.stats) : ''}
          <div 
            className="discription" 
            dangerouslySetInnerHTML={{__html: d ? this.state.showClan.description : ''}} 
          />
        </div>
      </div>
    )
  }
}
