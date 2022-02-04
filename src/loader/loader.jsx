import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import { Icon } from '../lib/icon'

export const Loader = ({ size, children }) => (
  <div className={`loader ${size || 'large'}`}>
    <Icon icon={faStroopwafel} spin />
    {children && <div className='loader-content'>{children}</div>}
  </div>
)
