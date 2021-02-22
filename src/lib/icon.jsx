import React from 'react'

export const Icon = ({ name, className, children }) => (
  <span className={`icon ${className || ''}`}>
    <i className={`fa fa-fw fa-${name}`} />
    {children}
  </span>
)
