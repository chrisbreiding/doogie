import _ from 'lodash'

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faArchive, faHome, faLaptopHouse, faMapMarkedAlt, faRoute } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import { useNavigate, useParams } from 'react-router-dom'
import AutosizeTextarea from 'react-textarea-autosize'
import React from 'react'

import { archivesStore } from '../archives/archives-store'
import { directionsUrl, mapUrl } from '../lib/util'
import { fieldsStore } from '../fields/fields-store'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { housesApi } from '../lib/api'
import { housesStore } from '../houses/houses-store'

import { Header } from '../app/header'
import { HouseInfo } from './house-info'
import { Icon } from '../lib/icon'
import { Loader } from '../loader/loader'

const Input = (props) => <input {...props} />

const update = (house, props) => {
  props.id = house.id

  house.update(props)
  housesApi.update(props)
}

const onChange = (house, key, e) => {
  update(house, {
    [key]: e.target.value,
  })
}

const listItemRegex = /(^\s*)\-/

const onKeyUp = (house, field, e) => {
  if (field.type !== 'textarea' || e.code !== 'Enter') return

  const textarea = e.target
  const text = textarea.value
  const cursorPosition = textarea.selectionStart
  const textBefore = text.substr(0, cursorPosition)
  const textAfter = text.substr(cursorPosition, text.length - cursorPosition)
  const lines = textBefore.split('\n')
  // does previous line have "- ", indicating it's a list item?
  const listItemmatch = _.nth(lines, -2).match(listItemRegex)

  if (!listItemmatch) return

  const indent = listItemmatch[1] || ''
  const addition = `${indent}- `

  update(house, {
    [field.id]: `${textBefore}${addition}${textAfter}`,
  })

  requestAnimationFrame(() => {
    // put the cursor back in the right place or else it will be at the end
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + addition.length
  })
}

const onSubmit = (e) => {
  e.preventDefault()
}

const Fields = observer(({ house }) => {
  if (!fieldsStore.fields.length) return <Loader />

  return _.map(fieldsStore.fields, (field) => {
    if (field.type === 'heading') {
      return <h3 key={field.id}>{field.displayLabel}</h3>
    }

    const TextField = field.type === 'textarea' ? AutosizeTextarea : Input
    const value = house.get(field.id)

    return (
      <fieldset key={field.id}>
        <label>{field.displayLabel}</label>
        <TextField
          value={value != null ? value : field.defaultNotes}
          onChange={_.partial(onChange, house, field.id)}
          onKeyUp={_.partial(onKeyUp, house, field)}
        />
      </fieldset>
    )
  })
})

export const House = observer(() => {
  const { houseId } = useParams()
  const navigate = useNavigate()

  const house = housesStore.getHouseById(houseId)

  const archive = () => {
    const archiveId = house.archiveId ? null : archivesStore.current.id

    update(house, { archiveId })
  }

  const remove = (e) => {
    e.preventDefault()

    if (confirm('Remove this house?')) {
      housesApi.remove(house.id)
      navigate('..')
    }
  }

  const links = fieldsStore.linkFields.filter((field) => !!house.get(field.id))

  return (
    <div className='house'>
      <Header>
        <h1><Icon icon={faHome}>{house.shortName}</Icon></h1>
      </Header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            className={HOUSE_NAME_KEY}
            value={house.name || ''}
            onChange={_.partial(onChange, house, HOUSE_NAME_KEY)}
          />
          <HouseInfo house={house} />
          <div className='links'>
            <ul>
              {links.map((field) => (
                <li key={field.id}>
                  <a
                    href={house.get(field.id)}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icon icon={faLaptopHouse}>{field.label}</Icon>
                  </a>
                </li>
              ))}
              {/* put in a spacer if uneven so map/direction pair stay in same row */}
              {links.length % 2 !== 0 && <li></li>}
              <li>
                <a
                  href={mapUrl(house.address)}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Icon icon={faMapMarkedAlt}>View on Map</Icon>
                </a>
              </li>
              <li>
                <a
                  href={directionsUrl(house.address)}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Icon icon={faRoute}>Driving Directions</Icon>
                </a>
              </li>
            </ul>
          </div>
          <Fields house={house} />
          {archivesStore.archives.length &&
            <button className='archive' onClick={archive}>
              <Icon icon={faArchive}>{house.archiveId ? 'Unarchive' : `Archive (${archivesStore.current.name})`}</Icon>
            </button>
          }
          <button className='remove' onClick={remove}>
            <Icon icon={faTrashAlt}>Remove</Icon>
          </button>
        </form>
      </main>
    </div>
  )
})
