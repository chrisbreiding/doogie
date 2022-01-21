import { faArchive } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import { Header } from '../app/header'
import { HousesList } from './houses-list'
import { Icon } from '../lib/icon'

export const ArchivedHouses = () => (
  <div className='archived-houses'>
    <Header>
      <Icon icon={faArchive}>Archived Houses</Icon>
    </Header>
    <main>
      <ul>
        <HousesList dataKey='archivedHouses' />
      </ul>
    </main>
  </div>
)
