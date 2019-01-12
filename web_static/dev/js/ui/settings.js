import React from 'react'
import n from '../funs/networking'

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
    const data = await n.getSettings(user.key, user.userID)
    if (data.status) {
      this.setState({
        hasData: true,
        fields: data.fields
      })
    } else {
      this.setState({
        hasData: true,
        globaErr: data.error
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
  settingsBlock(field, key) {
    return (
      <div key={key} className="settingsBlock">
        <h3>{field.screenname}</h3>
        <pre>{JSON.stringify(field, null, 2)}</pre>
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
