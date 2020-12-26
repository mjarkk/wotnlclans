import React, { useState } from 'react'

export default function Chart({ type }) {
  const [enabled, setEnabled] = useState(false);

  const spaceBetween = 100
  const xFrom = 150
  const yFrom = 250
  const x = 700
  const y = 700
  const xChartLines = Array.from({ length: x / spaceBetween }, (_, i) => xFrom + (i * spaceBetween))
  const yChartLines = Array.from({ length: y / spaceBetween }, (_, i) => yFrom + (i * spaceBetween))

  return (
    <div className={`chart chart-theme-${type}`}>
      <div className="actionBar">

      </div>
      { !WEBPACK_PRODUCTION ?
        <div
          className="actualChart"
        >
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="chart">
            <line x1="150" y1="50" x2="150" y2="850" strokeLinecap="round" style={{ stroke: 'rgba(156,0,183,1)', strokeWidth: '7' }} />
            <line x1="150" y1="850" x2="950" y2="850" strokeLinecap="round" style={{ stroke: 'rgba(156,0,183,1)', strokeWidth: '7' }} />

            {xChartLines.map((el, key) => {
              return <line key={key} x1={yFrom - 100} y1={el} x2={y + yFrom} y2={el} strokeLinecap="round" style={{ stroke: 'rgba(156,0,183,0.3)', strokeWidth: '4' }} />
            })}
            {yChartLines.map((el, key) => {
              return <line key={key} x1={el} y1={xFrom - 100} x2={el} y2={x + xFrom} strokeLinecap="round" style={{ stroke: 'rgba(156,0,183,0.3)', strokeWidth: '4' }} />
            })}

            <svg viewBox="0 0 1000 1000" x="0" y="830">
              <text textAnchor="end" x="100" y="100" transform="rotate(320)" style={{ fontSize: 40, fontWeight: 600 }}>Winrate</text>
            </svg>
            <svg viewBox="0 0 1000 1000" x="40" y="870">
              <text textAnchor="end" x="100" y="100" transform="rotate(320)" style={{ fontSize: 40, fontWeight: 600 }}>Score</text>
            </svg>
          </svg>
        </div>
        : ''}
    </div>
  )
}
