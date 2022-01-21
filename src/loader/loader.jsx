import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import React, { createElement } from 'react'

import { Icon } from '../lib/icon'

export const Loader = ({ el, size }) => (
  createElement(
    el || 'div',
    { className: `loader ${size || 'large'}` },
    <Icon icon={faStroopwafel} spin />,
  )
)
