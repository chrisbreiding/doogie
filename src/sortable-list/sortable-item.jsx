import { observer } from 'mobx-react'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { faBars, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../lib/icon'

export const SortableItem = observer(({ id, children }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleAttributes = {
    ...attributes,
    ...listeners,
  }

  const handle = (
    <span className='sortable-handle' {...handleAttributes}>
      <Icon icon={faEllipsisV} />
      <Icon icon={faEllipsisV} />
    </span>
  )

  return children({
    attributes: {
      ref: setNodeRef,
      style,
    },
    className: isDragging ? 'is-dragging' : '',
    handle,
  })
})
