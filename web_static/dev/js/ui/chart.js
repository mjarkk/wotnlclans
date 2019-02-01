import React from 'react'

export default class Chart extends React.Component {
  constructor(props) {
    super()
    this.state = {
      enabled: false
    }
    this.spaceBetween = 100
    this.xFrom = 150
    this.yFrom = 250
    this.x = 700
    this.y = 700
    this.xChartLines = Array.from({length: this.x / this.spaceBetween}, (_, i) => this.xFrom + (i * this.spaceBetween))
    this.yChartLines = Array.from({length: this.y / this.spaceBetween}, (_, i) => this.yFrom + (i * this.spaceBetween))
  }
  componentDidUpdate(prevProps) {
    
  }
  render() {
    return (
      <div className={`chart chart-theme-${this.props.type}`}>
        <div className="actionBar">

        </div>
        { !WEBPACK_PRODUCTION ? 
          <div 
            className="actualChart"
          >
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="chart">
              <line x1="150" y1="50" x2="150" y2="850" strokeLinecap="round" style={{stroke: 'rgba(156,0,183,1)', strokeWidth: '7'}}/>
              <line x1="150" y1="850" x2="950" y2="850" strokeLinecap="round" style={{stroke: 'rgba(156,0,183,1)', strokeWidth: '7'}}/>
              
              {this.xChartLines.map((el, key) => {
                return <line key={key} x1={this.yFrom-100} y1={el} x2={this.y + this.yFrom} y2={el}  strokeLinecap="round" style={{stroke: 'rgba(156,0,183,0.3)', strokeWidth: '4'}}/>
              })}
              {this.yChartLines.map((el, key) => {
                return <line key={key} x1={el} y1={this.xFrom-100} x2={el} y2={this.x + this.xFrom}  strokeLinecap="round" style={{stroke: 'rgba(156,0,183,0.3)', strokeWidth: '4'}}/>
              })}

              <svg viewBox="0 0 1000 1000" x="0" y="830">
                <text textAnchor="end" x="100" y="100" transform="rotate(320)" style={{fontSize: 40, fontWeight: 600}}>Winrate</text>
              </svg>
              <svg viewBox="0 0 1000 1000" x="40" y="870">
                <text textAnchor="end" x="100" y="100" transform="rotate(320)" style={{fontSize: 40, fontWeight: 600}}>Score</text>
              </svg>
            </svg>
          </div>
        : '' }
      </div>
    )
  }
}
