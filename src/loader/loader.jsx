import React, { createElement } from 'react'

import { Icon } from '../lib/icon'

export const Loader = ({ el, size }) => (
  createElement(
    el || 'div',
    { className: `loader ${size || 'large'}` },
    <Icon name='spin fa-spinner' />,
  )
)
