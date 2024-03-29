import cs from 'classnames'
import { faAlignJustify, faGripLines, faHeading, faLink, faPlus, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'

import { fieldsApi } from '../lib/api'
import { fieldsStore } from './fields-store'

import { Header } from '../app/header'
import { Icon } from '../lib/icon'
import { Loader } from '../loader/loader'
import { MenuGroup } from '../menu/menu-group'
import { SortableItem } from '../sortable-list/sortable-item'

const getIcon = (type) => {
  switch (type) {
    case 'heading':
      return faHeading
    case 'link':
      return faLink
    case 'textarea':
      return faAlignJustify
    default:
      return faGripLines
  }
}

const FieldItem = observer(({ field }) => (
  <SortableItem id={field.id}>
    {({ attributes, className, handle }) => (
      <li
        className={cs('field-item sortable-item', `field-type-${field.type}`, className)}
        {...attributes}
      >
        {handle}
        <Link to={field.id}>
          {field.displayLabel} <Icon icon={getIcon(field.type)} />
        </Link>
      </li>
    )}
  </SortableItem>
))

export const Fields = observer(() => {
  const navigate = useNavigate()
  const state = useLocalStore(() => ({
    addingField: false,
    setAddingField (adding) {
      state.addingField = adding
    },
  }))

  const addField = () => {
    state.setAddingField(true)

    fieldsApi.add(action((id) => {
      fieldsStore.addField({ id })
      state.setAddingField(false)
      navigate(id)
    }))
  }

  const updateSorting = (ids) => {
    fieldsStore.updateSorting(ids)
    fieldsApi.updateSorting(ids)
  }

  if (state.addingField) return <Loader />

  return (
    <>
      <div className='fields'>
        <Header>
          <h1><Icon icon={faSlidersH}>Fields</Icon></h1>
        </Header>
        <main>
          <ul className='menu'>
            <MenuGroup
              sortable={true}
              items={fieldsStore.fields}
              onSortingUpdate={updateSorting}
            >
              {(field) => (
                <FieldItem key={field.id} field={field} />
              )}
            </MenuGroup>
            <MenuGroup>
              <li>
                <button onClick={addField}>
                  <Icon icon={faPlus}>Add Field</Icon>
                </button>
              </li>
            </MenuGroup>
          </ul>
        </main>
      </div>
      <Outlet />
    </>
  )
})
