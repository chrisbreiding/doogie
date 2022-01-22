import _ from 'lodash'
import { faAlignJustify, faBars, faGripLines, faHeading, faLink, faPlus, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import { Link, Route, useHistory, useRouteMatch } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'

import { fieldsApi } from '../lib/api'
import { fieldsStore } from './fields-store'

import { Field } from './field'
import { Header } from '../app/header'
import { Icon } from '../lib/icon'
import { Loader } from '../loader/loader'
import { MenuGroup } from '../menu/menu-group'

const handleClass = 'handle-icon'

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

const FieldItem = observer(({ field, url }) => (
  <li className={`sortable-item field-item field-type-${field.type}`} data-id={field.id}>
    <Icon icon={faBars} outerClassName={handleClass} />
    <Link to={`${url}/${field.id}`}>
      {field.displayLabel} <Icon icon={getIcon(field.type)} />
    </Link>
  </li>
))

export const Fields = observer(() => {
  const match = useRouteMatch()
  const history = useHistory()
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
      history.push(`${match.path}/${id}`)
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
          <Icon icon={faSlidersH}>Fields</Icon>
        </Header>
        <main>
          <ul className='menu'>
            <MenuGroup
              sortable={true}
              handleClass={handleClass}
              onSortingUpdate={updateSorting}
            >
              {_.map(fieldsStore.fields, (field) => (
                <FieldItem key={field.id} field={field} url={match.url} />
              ))}
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
      <Route path={`${match.path}/:id`} component={Field} />
    </>
  )
})
