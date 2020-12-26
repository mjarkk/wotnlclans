import React from 'react'
import cn from 'classnames'

export default function Button({ disabled, click, title, dark, style }) {
  return (
    <button
      disabled={typeof disabled == 'boolean' ? disabled : false}
      className={cn(style || 'outline', { dark: typeof dark == 'boolean' ? dark : true })}
      onClick={click}
    >{title}</button>
  )
}
