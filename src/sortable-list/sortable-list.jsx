import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const setBodyClass = (className) => {
  document.body.className = className
}

export const SortableList = ({ items, renderItem, onSortingUpdate }) => {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
  )

  const onDragStart = ({ active }) => {
    setBodyClass('unselectable')
    setActiveId(active.id)
  }

  const onDragEnd = ({ active, over }) => {
    setBodyClass('')

    if (active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    const sortedItems = arrayMove(items, oldIndex, newIndex)

    onSortingUpdate(sortedItems.map((item) => item.id))
  }

  const onDragCancel = () => {
    setBodyClass('')
  }

  return (
    <DndContext
      autoScroll={true}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      sensors={sensors}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => renderItem(item))}
      </SortableContext>

      <DragOverlay>
        {activeId && renderItem(items.find((item) => item.id === activeId))}
      </DragOverlay>
    </DndContext>
  )
}
