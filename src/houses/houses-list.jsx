import cs from 'classnames'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { directionsUrl } from '../lib/util'
import { housesStore } from './houses-store'
import { housesApi } from '../lib/api'
import { settingsStore } from '../settings/settings-store'

import { Icon } from '../lib/icon'
import { MenuGroup } from '../menu/menu-group'
import { SortableItem } from '../sortable-list/sortable-item'

const House = observer(({ house }) => {
  const askingPrice = house.get(settingsStore.get('askingPriceField'))
  const visit = house.get(settingsStore.get('visitField'))

  return (
    <SortableItem id={house.id}>
      {({ attributes, className, handle }) => (
        <li className={cs('list-house sortable-item', className)} {...attributes}>
          {handle}
          <Link to={`houses/${house.id}`}>
            <h3>{house.shortName}<span>{house.city}</span></h3>
            <p>${askingPrice}<span>&nbsp;{visit}</span></p>
          </Link>
          <a
            className='directions'
            href={directionsUrl(house.address)}
            target='_blank'
            rel='noreferrer'
          >
            <Icon icon={faRoute} />
          </a>
        </li>
      )}
    </SortableItem>
  )
})

const updateSorting = (ids) => {
  housesStore.updateSorting(ids)
  housesApi.updateSorting(ids)
}

export const HousesList = observer(({ houses }) => (
  <MenuGroup
    sortable={true}
    items={houses}
    onSortingUpdate={updateSorting}
  >
    {(house) => (
      <House key={house.id} house={house} />
    )}
  </MenuGroup>
))
