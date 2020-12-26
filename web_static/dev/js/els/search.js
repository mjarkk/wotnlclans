import React, { createRef } from 'react'
import SVG from './svg'

export default function Search({ showIcon, onChange, placeholder }) {
  const inputRef = createRef()

  return (
    <div className="inputWrapper">
      <input
        ref={inputRef}
        onChange={e => {
          if (onChange) {
            onChange(e.target.value)
          }
        }}
        placeholder={placeholder || ''}
      />
      {typeof showIcon == 'undefined' || showIcon ?
        <div
          className="isvg"
          onClick={() => inputRef.current.focus()}
        >
          <SVG icon="search" />
        </div>
        : ''}
    </div>
  )
}
