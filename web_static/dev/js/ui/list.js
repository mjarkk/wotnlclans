import React from 'react'
import n from '../funs/networking'
import f from '../funs/functions'
import d from '../funs/dynamic'

const SVG = d(import('../els/svg'))
const Search = d(import('../els/search'))
const Button = d(import('../els/button'))
const Chart = d(import('./chart'))
const ClanDetials = d(import('./clandetails'))

export default class List extends React.Component {
  constructor(props) {
    super()
    this.state = Object.assign({
      fetchedClans: 50,
      list: [],
      iconsLocation: {},
      iconsPicture: '',
      imgSize: {
        height: 0,
        width: 0,
        oneItem: 0
      },
      haveClanIds: {},
      sortedList: undefined,
      filter: '',
      sortOn: '',
      isFetchingData: false,
      haveAllClans: false
    }, props)
    
    this.search = {
      buzzy: false,
      lastFilter: ''
    }

    this.canSetState = true
    this.lastListItem = undefined
    this.scrollEvHandeler = async () => {
      const fromTop = document.documentElement.scrollTop
      if (fromTop + window.innerHeight + 600 > this.lastListItem.offsetTop && !this.state.isFetchingData && !this.state.haveAllClans) {
        this.state.isFetchingData = true
        this.setState({
          isFetchingData: true
        })
        const sortedList = this.state.sortedList[this.state.sortOn]
        if (sortedList) {
          const toFetch = []
          for (let i = 0; i < sortedList.length; i++) {
            const clanID = sortedList[i]
            if (!this.state.haveClanIds[clanID]) {
              if (toFetch.length < 50) {
                toFetch.push(clanID)
              } else {
                break
              }
            }
          }
          if (toFetch.length != 0) {
            const out = await n.getClansByID(toFetch)
            if (out.status) {
              let list = this.state.list
              list.push(...out.data)
              list = f.sortList(this.state.sortOn, list)
              const haveClanIds = this.state.haveClanIds
              toFetch.map(id => {
                haveClanIds[id] = true
              })
              this.setState({
                fetchedClans: this.state.fetchedClans + 50,
                list, 
                haveClanIds
              }, () => {
                this.setState({
                  isFetchingData: false,
                })
              })
              f.setCurrentClans(list)
            } else {
              // something whend wrong on the fetch side
            }
          } else {
            this.setState({
              haveAllClans: true,
              isFetchingData: false
            })
            // show there are not more clans to fetch
          }
        }
      }
    }
  }
  componentWillUpdate(_, nextState) {
    if (this.state.filter != nextState.filter) {
      this.searchForClans(nextState, false)
    }
  }
  searchForClans(nextState, force) {
    const filter = nextState.filter
    if ((!this.search.buzzy || force) && filter) {
      this.search = {
        buzzy: true,
        lastFilter: this.state.filter
      }
      setTimeout(async () => {
        const out = await n.search(filter, nextState.sortOn)
        if (out.status) {
          const toFetch = []
          const haveClanIds = this.state.haveClanIds
          out.data.map(id => {
            if (!haveClanIds[id]) {
              haveClanIds[id] = true
              toFetch.push(id)
            }
          })

          this.state.haveClanIds = haveClanIds

          const clans = toFetch.length == 0 ? {status: false} : await n.getClansByID(toFetch)
          if (clans.status) {
            this.setState({
              list: f.sortList(this.state.sortOn, [...this.state.list, ...clans.data]),
            })
          }
        }
        setTimeout(() => {
          const currentFilter = this.state.filter
          if (filter != currentFilter) {
            this.searchForClans(this.state, true)
          } else {
            this.search = {
              buzzy: false,
              lastFilter: currentFilter
            }
          }
        }, 50)
      }, 50)
    }
  }
  componentDidMount() {
    this.getNeededInfo()
    this.canSetState = true
  }
  componentWillUnmount() {
    this.canSetState = false
    window.removeEventListener('scroll', this.scrollEvHandeler)
  }
  watchScroll() {
    window.addEventListener('scroll', this.scrollEvHandeler)
  }
  async getNeededInfo() {
    const list = await n.getClanList()
    if (!this.canSetState) {
      return
    }
    this.setState({
      list
    })
    const iconsLocation = f.clanIconsToIndex(await n.getIconsLocation())
    const iconsPicture = await n.getIconsPicture()
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
    const out = await n.getFilteredList()
    if (out.status) {
      const sortOn =  out.default
      const sortedList = f.clanPos(out.data)
      const haveClanIds = f.haveClanIds(sortedList, sortOn)
      this.setState({
        haveClanIds,
        sortedList, 
        sortOn
      })
      this.watchScroll()
    } else {
      // show error
    }
    f.setCurrentClans(list)
  }
  async filterOn(sortOn) {
    this.setState({
      sortOn,
      list: f.sortList(sortOn, this.state.list)
    }, () => {
      let toFetch = [[]]
      const sortedList = this.state.sortedList[sortOn]
      for (let i = 0; i < sortedList.length; i++) {
        if (i < this.state.fetchedClans) {
          const id = sortedList[i]
          const isTrue = this.state.haveClanIds[id]
          if (!isTrue) {
            if (toFetch[toFetch.length - 1].length == 50) {
              toFetch.push([])
            }
            toFetch[toFetch.length - 1].push(id)
          }
        } else {
          break
        }
      }

      const haveClanIds = this.state.haveClanIds
      let canSetState = false
      toFetch.reduce((acc, curr) => {acc.push(...curr); return acc}, []).map(id => {
        canSetState = true
        haveClanIds[id] = true
      })
      if (canSetState) {
        this.setState({
          haveClanIds
        })
      }

      toFetch.map(async (toFetchSubArr) => {
        if (toFetchSubArr.length > 0) {
          const clans = await n.getClansByID(toFetchSubArr)
          if (clans.status) {
            this.setState({
              list: f.sortList(this.state.sortOn, [...this.state.list, ...clans.data]),
            })
          }
        }
      })
    })
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
          <div className="filterOnList">
            {([
              ['efficiency', 'Rating'], 
              ['globrating', 'Global'], 
              ['winratio', 'Winrate'], 
              ['fbelo', 'Strongholds'], 
              ['battles', 'Battles'], 
              ['gmelo10', 'Global 10']
            ]).map((filter, key) =>
              <Button 
                key={key}
                style={this.state.sortOn == filter[0] || (this.state.sortOn == '' && key == 0) ? 'selected' : 'outline'} 
                click={() => this.filterOn(filter[0])} 
                title={filter[1]}
              />
            )}
          </div>
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
                    ref={htmlEl => {
                      if (id == (this.state.list.length - 1)) {
                        this.lastListItem = htmlEl
                      }
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
                    <div className="rating clanEfficiency">
                      <span>Rating</span>
                      <span>{item.stats.efficiency}</span>
                    </div>
                    <div className="rating clanRating">
                      <span>Global</span>
                      <span>{item.stats.globrating}</span>
                    </div>
                    <div className="rating winrate">
                      <span>Winrate</span>
                      <span>{item.stats.winratio}%</span>
                    </div>
                    <div className="rating global">
                      <span>Global 10</span>
                      <span>{item.stats.gmelo10}</span>
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
                      <SVG icon="arrow"/>
                    </div>
                  </div>
                )
              })
            : <div className="loading">
                loading...
              </div>
          }
          { this.state.isFetchingData ?
            <div className="loading">loading...</div>
          :''}
          { this.state.haveAllClans ?
            <div className="loading">End of the list :(</div>
          : ''}
        </div>
        { !this.props.isMobile
          ? <div className="chartAndStats">
              <Chart
                type="light"
              />
              <ClanDetials showClan={this.props.showClan} isMobile={this.props.isMobile} />
            </div>
        : ''}
      </div>
    )
  }
}
