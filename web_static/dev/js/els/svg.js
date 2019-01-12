import React from 'react'
import SVG from 'react-inlinesvg'
import arrow from '../../icons/arrow.svg'
import close from '../../icons/close.svg'
import search from '../../icons/search.svg'

const returnIcon = icon => {
  const options = [
    ['arrow', arrow],
    ['close', close],
    ['search', search]
  ]
  let toUse = ''
  for (const option of options) {
    if (option[0] == icon) {
      toUse = option[1]
      break
    }
  }
  return toUse
}

export default props => <SVG src={`data:image/svg+xml,${returnIcon(props.icon)}`} />
