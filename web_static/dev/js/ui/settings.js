import React from 'react'
import n from '../funs/networking'
import Button from '../els/button'

export default class Settings extends React.Component {
  constructor() {
    super()
    this.state = {
      hasData: false,
      globaErr: undefined,
      fields: []
    }
    this.startedFetchingAllData = false
  }
  componentDidMount() {
    if (this.props.user.key) {
      this.fetchAllSettings(this.props.user)
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasData && !this.startedFetchingAllData && prevProps.user.key != this.props.user.key) {
      this.fetchAllSettings(this.props.user)
    }
  }
  async fetchAllSettings(user) {
    this.startedFetchingAllData = true
    let data = await n.getSettings(user.key, user.userID)
    if (data.status) {
      data.fields = data.fields.map(field => 
        Object.assign({}, field.type == 'array' 
          ? Object.assign({}, field, {
              view: 'easy',
              clansTmp: field.clans
            }) 
          : field
        , {
          blocked: false,
          error: undefined,
          doingThings: false
        })
      )
      this.setState({
        hasData: true,
        fields: data.fields
      })
    } else {
      this.setState({
        hasData: true,
        globaErr: data.error,
      })
    }
  }
  componentWillUnmount() {
    this.startedFetchingAllData = false
    this.setState({
      hasData: false,
      globaErr: undefined
    })
  }
  updateSetting(toWhat, whatToUpdate, key) {
    let fields = this.state.fields
    fields[key][whatToUpdate] = toWhat
    this.setState({
      fields
    })
  }
  updateMoreSettings(toWhat, whatToUpdate, key) {
    let fields = this.state.fields
    toWhat.map((_, id) => {
      fields[key][whatToUpdate[id]] = toWhat[id]
    })
    this.setState({
      fields
    })
  }
  settingsBlock(field, key) {
    return (
      <div key={key} className="settingsBlock">
        <h3>{field.screenname}</h3>
        {field.type == 'array' 
        ? <div className="actualSettings array">
            <div className="viewOptions">
              <Button style={field.view == 'easy' ? 'selected' : 'outline' } title="easy" click={() => this.updateSetting('easy', 'view', key)}/>
              <Button style={field.view == 'raw' ? 'selected' : 'outline'} title="raw" click={() => this.updateSetting('raw', 'view', key)}/>
            </div>
            {field.view == 'raw'
              ? <div className="rawEdit">
                  {((field, key) => {
                    const value = typeof field.clansTmp == 'string' ? field.clansTmp : JSON.stringify(field.clansTmp, null, 2)
                    const matched = value.match(/\n/g)
                    return (
                      <textarea 
                        rows={matched ? matched.length + 1 : 1}
                        cols="40"
                        value={value}
                        onChange={e => {
                          const value = e.target.value
                          try {
                            const jsonValue = JSON.parse(value)
                            let hasErr = undefined
                            if (!(jsonValue instanceof Array)) {
                              hasErr = 'Data must be an array'
                            } else if (jsonValue.reduce((acc, curr) => 
                              !(
                                typeof curr == 'string' 
                                && curr.length == 9
                                && curr.split('').reduce((out, letter) => /[0-9]/.test(letter) ? out : false, true)
                              )
                                ? acc 
                                : false
                              , true
                            )) {
                              hasErr = 'Items must be clan id\'s'
                            }
                            this.updateMoreSettings(
                              [jsonValue, hasErr, jsonValue], 
                              ['clansTmp', 'error', 'clans'], 
                              key
                            )
                          } catch (error) {
                            this.updateMoreSettings(
                              [value, 'Can\'t parse json'], 
                              ['clansTmp', 'error'], 
                              key
                            )
                          }
                        }}
                      ></textarea>
                    )
                  })(field, key)}
                </div>
              : <div className="listEdit">

                </div>
            }
          </div> 
        : <div className="actualSettings"></div>
        }
        {field.error ?
          <div className="error">
            {field.error}
          </div>
        :''}
        <div className="buttonsRow">
          <Button
            disabled={!!field.error}
            click={() => {
              console.log(field)
            }}
            title="Update"
          />
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="settings">
        <h2>Settings</h2>
        { this.state.globaErr
          ? <div className="error">
              <h4>Error:</h4>
              <p>{this.state.globaErr}</p>
            </div>
          : <div className="fields">
              {this.state.fields.map((field, key) => this.settingsBlock(field, key))}
            </div>
        }
      </div>
    )
  }
}
