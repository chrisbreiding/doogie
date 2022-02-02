import { faHouseDamage } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import { Icon } from '../lib/icon'

export const NoHouses = () => (
  <p className='empty'>
    <Icon icon={faHouseDamage}>No houses</Icon>
  </p>
)
