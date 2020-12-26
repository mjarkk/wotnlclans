import React from 'react'
import SVG from 'react-inlinesvg'
import arrow from '../../icons/arrow.svg'
import close from '../../icons/close.svg'
import search from '../../icons/search.svg'
import plus from '../../icons/plus.svg'
import plusBlock from '../../icons/plusBlock.svg'
import filledInfo from '../../icons/filledInfo.svg'
import removeBlock from '../../icons/removeBlock.svg'

const getIcon = icon => {
  const options = [
    ['arrow', arrow],
    ['close', close],
    ['search', search],
    ['plus', plus],
    ['plusBlock', plusBlock],
    ['removeBlock', removeBlock],
    ['filledInfo', filledInfo]
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

export default function SVGElement({ icon }) {
  return <SVG src={`data:image/svg+xml,${getIcon(icon)}`} />
}
