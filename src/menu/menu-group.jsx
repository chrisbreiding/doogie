import { observer } from 'mobx-react'
import React from 'react'

import { SortableList } from '../sortable-list/sortable-list'

export const MenuGroup = observer((props) => {
  const {
    items,
    children,
    onSortingUpdate = () => {},
    sortable = false,
  } = props

  if (!sortable) {
    return (
      <li>
        <ul className='menu-group'>{children}</ul>
      </li>
    )
  }

  return (
    <li>
      <ul className='menu-group'>
        <SortableList
          items={items}
          renderItem={children}
          onSortingUpdate={onSortingUpdate}
        />
      </ul>
    </li>
  )
})
