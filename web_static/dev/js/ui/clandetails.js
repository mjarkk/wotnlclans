import React from 'react'
import cn from 'classnames'
import d from '../funs/dynamic'
import n from '../funs/networking'

const Icon = d(import('../els/svg'))

export default class ClanDetials extends React.Component {
  constructor(props) {
    super()
    this.state = {
      showIcon: props.showClan && props.showClan.emblems ? this.getIcon(props.showClan.emblems) : '',
      showClan: props.showClan,
    }
    if (this.state.showClan) {
      n.getDescription(this.state.showClan.id).then(description => {
        const showClan = this.state.showClan
        showClan.description = description
        this.setState({
          showClan
        })
      })
    }
  }
  renderStats(clan) {
    const list = [
      { type: 'one', item: 'efficiency', name: 'Efficiency' },
      { type: 'one', item: 'glob_rating', name: 'Global' },
      { type: 'one', item: 'glob_rating_weighted', name: 'Global weighted' },
      { type: 'one', item: 'members', name: 'Members' },
      { type: 'one', item: 'battles', name: 'Total battles' },
      { type: 'one', item: 'daily_battles', name: 'Daily battles' },
      { type: 'one', item: 'win_ratio', name: 'Win rate' },
      { type: 'one', item: 'v10l', name: 'v10l' },
      {
        type: 'multiple', items: [
          { item: 'fb_elo10', name: '10' },
          { item: 'fb_elo8', name: '8' },
          { item: 'fb_elo6', name: '6' },
          { item: 'fb_elo', name: '±' }
        ], name: 'fbelo'
      },
      {
        type: 'multiple', items: [
          { item: 'gm_elo10', name: '10' },
          { item: 'gm_elo8', name: '8' },
          { item: 'gm_elo6', name: '6' },
          { item: 'gm_elo', name: '±' }
        ], name: 'global'
      },
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
                {item.items.map((el, key, arr) =>
                  <div key={key} className={cn('stat', { first: key == 0, last: key == (arr.length - 1) })}>
                    <span className="what">{el.name}:</span>
                    <span className="value">{clan[el.item]}</span>
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
      }, async () => {
        const showClan = this.state.showClan
        showClan.description = await n.getDescription(showClan.id)
        this.setState({
          showClan
        })
      }))
    }
  }
  getIcon(emblems) {
    return (emblems.x195_portal || emblems.x64_portal || '').replace(/http(s)?/, 'https')
  }
  render() {
    const d = this.state.showClan && this.state.showClan.tag
    return (
      <div className={cn('clanDetials', { show: this.props.showClan && this.props.showClan.tag })}>
        <div className="clanDetialsInner">
          <div className="actionBar">
            <div className="back" onClick={() => location.hash = '/'}>
              <Icon icon="close" />
            </div>
            {d && CONF_SPONSOR?.clanID && this.state.showClan.id == CONF_SPONSOR?.clanID ?
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
            dangerouslySetInnerHTML={{ __html: d ? this.state.showClan.description : '' }}
          />
        </div>
      </div>
    )
  }
}
