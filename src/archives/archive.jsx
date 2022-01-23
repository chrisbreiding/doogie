import { faArchive, faEdit, faMapPin, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { archivesApi } from '../lib/api'
import { archivesStore } from './archives-store'
import { housesStore } from '../houses/houses-store'
import * as backHistory from '../lib/back-history'

import { Header } from '../app/header'
import { HousesList } from '../houses/houses-list'
import { Icon } from '../lib/icon'

const ArchiveEditor = observer(({ archive }) => {
  const history = useHistory()

  const onSubmit = (e) => {
    e.preventDefault()
  }

  const onChange = (key, value) => {
    archive.update({ [key]: value })
    archivesApi.update(archive.serialize())
  }

  const onChangeName = (e) => {
    onChange('name', e.target.value)
  }

  const onChangeIsCurrent = (e) => {
    archivesStore.resetCurrent()
    onChange('isCurrent', e.target.checked)
  }

  const remove = () => {
    if (confirm('Remove this archive?')) {
      archivesApi.remove(archive.id)
      history.push(backHistory.pop())
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <label>Name</label>
        <input value={archive.name} onChange={onChangeName} />
      </fieldset>
      <fieldset>
        <label className='checkbox-label'>
          <input
            type='checkbox'
            checked={archive.isCurrent}
            onChange={onChangeIsCurrent}
          />
          Current <Icon icon={faMapPin} />
        </label>
      </fieldset>
      <button className='remove' onClick={remove}>
        <Icon icon={faTrashAlt}>Remove</Icon>
      </button>
    </form>
  )
})

export const Archive = observer(() => {
  const { id } = useParams()
  const archive = archivesStore.getArchiveById(id)
  const houses = housesStore.archivedHouses(id)
  const state = useLocalStore(() => ({
    isEditing: !archive.name,
    setIsEditing: action((isEditing) => {
      state.isEditing = isEditing
    }),
  }))

  const toggleIsEditing = () => {
    state.setIsEditing(!state.isEditing)
  }

  return (
    <div className='archive'>
      <Header onBack={() => state.setIsEditing(false)}>
        <h1><Icon icon={faArchive}>{archive.name}</Icon></h1>
        <button onClick={toggleIsEditing} className='edit'>
          <Icon icon={faEdit}>
            {state.isEditing ? 'Done' : 'Edit'}
          </Icon>
        </button>
      </Header>
      <main>
        {state.isEditing && <ArchiveEditor archive={archive} />}
        <ul className='menu'>
          <HousesList houses={houses} />
        </ul>
        {!houses.length && <p className='empty'>No houses</p>}
      </main>
    </div>
  )
})
