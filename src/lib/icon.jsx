import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const Icon = ({ outerClassName, children, ...props }) => (
  <span className={`icon ${outerClassName || ''}`}>
    <FontAwesomeIcon {...props} />
    {children}
  </span>
)
