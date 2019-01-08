import React from 'react'
import SVG from 'react-inlinesvg'
import arrow from '../../icons/arrow.svg'
import close from '../../icons/close.svg'

const returnIcon = icon => {
  switch (icon) {
    case 'arrow':
      return arrow
    case 'close':
      return close
    default:
      return ''
  }
}

export default (props) => <SVG src={`data:image/svg+xml,${returnIcon(props.icon)}`} />
