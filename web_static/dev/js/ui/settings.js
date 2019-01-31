import React from 'react'
import cn from 'classnames'
import f from '../funs/functions'
import d from '../funs/dynamic'
import n from '../funs/networking'

const SVG = d(import('../els/svg'))
const Button = d(import('../els/button'))

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
        <p className="discription">{field.discription}</p>
        {field.type == 'array' 
        ? <div className="actualSettings array">
            <div className="viewOptions">
              <Button 
                disabled={!!field.error} 
                style={field.view == 'easy' ? 'selected' : 'outline' } 
                title="easy" 
                click={() => this.updateSetting('easy', 'view', key)}
              />
              <Button 
                style={field.view == 'raw' ? 'selected' : 'outline'} 
                title="raw" 
                click={() => this.updateSetting('raw', 'view', key)}
              />
            </div>
            {field.view == 'raw'
              ? <div className="rawEdit">
                  {((field, key) => {
                    const value = typeof field.clansTmp == 'string' 
                      ? field.clansTmp 
                      : JSON.stringify(field.clansTmp, null, 2)
                    const matched = value.match(/\n/g)
                    return (
                      <textarea 
                        disabled={field.doingThings}
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
                            } else if (jsonValue.reduce((acc, curr) => f.isClanId(curr) ? acc : true, false)) {
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
                  {field.clansTmp.map((_, fieldItem) => 
                    this.inputBox(
                      fieldItem, 
                      false, 
                      field.clansTmp, 
                      field.doingThings,
                      clans => this.updateMoreSettings(
                        [clans, clans, clans.every(clanID => f.isClanId(clanID)) ? undefined : 'not all items are clan id\'s'], 
                        ['clansTmp', 'clans', 'error'], 
                        key
                      ), error => this.updateSetting(error, 'error', key)
                    )
                  )}
                  {this.inputBox(
                    field.clansTmp.length, 
                    true, 
                    field.clansTmp, 
                    field.doingThings,
                    clans => this.updateMoreSettings(
                      [clans, clans, clans.every(clanID => f.isClanId(clanID)) ? undefined : 'not all items are clan id\'s'], 
                      ['clansTmp', 'clans', 'error'], 
                      key
                    ), 
                    error => this.updateSetting(error, 'error', key)
                  )}
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
            disabled={!!field.error || field.doingThings}
            click={async () => {
              this.updateSetting(true, 'doingThings', key)
              const user = this.props.user
              const out = await n.updateClanIDsList(user.key, user.userID, field.updateurl, field.clans)
              this.updateMoreSettings([false, out.error], ['doingThings', 'error'], key)
            }}
            title="Update"
          />
        </div>
      </div>
    )
  }
  inputBox(key, isAddNew, clans, buzzy, newClansCB, errorCB) {
    let inputelement = undefined
    const setInputVar = element => inputelement = element
    return (
      <div key={isAddNew ? false : key} className="textItem">
        <textarea
          ref={setInputVar}
          rows="1"
          cols="9"
          value={clans[key]}
          disabled={buzzy}
          onChange={e => {
            if (!isAddNew) {
              const val = e.target.value
              const out = [].concat.apply([],val.split(',').map(arr => arr.split(' ')))
              clans[key] = out[0]
              clans.push(...out.splice(1))
              newClansCB(clans)
            }
          }}
        ></textarea>
        {isAddNew ? '' :
          <div 
            disabled={buzzy}
            className={cn('remove', 'icon', {disabled: buzzy})}
            onClick={() => {
              if (!buzzy) {
                clans.splice(key, 1)
                newClansCB(clans)
              }
            }}
          >
            <SVG icon="removeBlock"/>
          </div>
        }
        <div 
          className={cn('add', 'icon', {disabled: buzzy})}
          onClick={() => {
            if (!buzzy) {
              if (inputelement) {
                const out = [].concat.apply([],inputelement.value.split(',').map(arr => arr.split(' ')))
                clans.push(...out)
                newClansCB(clans)
                inputelement.value = ''
              } else {
                errorCB('Can\'t find element')
              }
            }
          }}
        >
          <SVG icon="plusBlock"/>
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
