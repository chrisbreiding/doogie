import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const Icon = ({ outerClassName, children, transferAttributes, ...props }) => (
  <span className={`icon ${outerClassName || ''}`} {...transferAttributes}>
    <FontAwesomeIcon {...props} />
    {children}
  </span>
)
