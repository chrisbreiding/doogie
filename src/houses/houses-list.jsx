import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { housesStore } from './houses-store'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { housesApi } from '../lib/api'
import { settingsStore } from '../settings/settings-store'

import { Icon } from '../lib/icon'
import { MenuGroup } from '../menu/menu-group'

const handleClass = 'handle-icon'

const House = observer(({ house }) => {
  const cost = house.get(settingsStore.get('costField'))
  let description = cost ? `$${cost}` : ''
  const visit = house.get(settingsStore.get('visitField'))

  if (cost && visit) description += `, ${visit}`

  const id = house.get('id')

  return (
    <li
      className='sortable-item list-house'
      data-id={id}
    >
      <Icon name='bars' className={handleClass} />
      <Link to={`/houses/${id}`}>
        <h3>{house.get(HOUSE_NAME_KEY)}</h3>
        <p>{description}&nbsp;</p>
      </Link>
    </li>
  )
})

const updateSorting = (ids) => {
  housesStore.updateSorting(ids)
  housesApi.updateSorting(ids)
}

export const HousesList = observer(({ dataKey }) => (
  <MenuGroup
    sortable={true}
    handleClass={handleClass}
    onSortingUpdate={updateSorting}
  >
    {_.map(housesStore[dataKey], (house) => (
      <House key={house.get('id')} house={house} />
    ))}
  </MenuGroup>
))
