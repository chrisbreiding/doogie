import { observer } from 'mobx-react'
import React from 'react'

import { SortableList } from '../sortable-list/sortable-list'

export const MenuGroup = observer((props) => {
  const {
    children,
    handleClass,
    onSortingUpdate = () => {},
    sortable = false,
  } = props

  if (!sortable) {
    return (
      <li>
        <ul>{children}</ul>
      </li>
    )
  }

  return (
    <li>
      <SortableList
        el='ul'
        handleClass={handleClass}
        onSortingUpdate={onSortingUpdate}
      >
        {children}
      </SortableList>
    </li>
  )
})
