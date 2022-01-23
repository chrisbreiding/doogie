import cs from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { housesStore } from './houses-store'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { housesApi } from '../lib/api'
import { settingsStore } from '../settings/settings-store'

import { MenuGroup } from '../menu/menu-group'
import { SortableItem } from '../sortable-list/sortable-item'

const House = observer(({ house }) => {
  const cost = house.get(settingsStore.get('costField'))
  let description = cost ? `$${cost}` : ''
  const visit = house.get(settingsStore.get('visitField'))

  if (cost && visit) description += `, ${visit}`

  return (
    <SortableItem id={house.id}>
      {({ attributes, className, handle }) => (
        <li className={cs('list-house sortable-item', className)} {...attributes}>
          {handle}
          <Link to={`/houses/${house.id}`}>
            <h3>{house.get(HOUSE_NAME_KEY)}</h3>
            <p>{description}&nbsp;</p>
          </Link>
        </li>
      )}
    </SortableItem>
  )
})

const updateSorting = (ids) => {
  housesStore.updateSorting(ids)
  housesApi.updateSorting(ids)
}

export const HousesList = observer(({ dataKey }) => (
  <MenuGroup
    sortable={true}
    items={housesStore[dataKey]}
    onSortingUpdate={updateSorting}
  >
    {(house) => (
      <House key={house.id} house={house} />
    )}
  </MenuGroup>
))
