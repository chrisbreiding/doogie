import { observer } from 'mobx-react'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { faBars } from '@fortawesome/free-solid-svg-icons'
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
    <Icon icon={faBars} transferAttributes={handleAttributes} />
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
