import _ from 'lodash'

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faArchive, faLaptopHouse, faMapMarkedAlt, faRoute } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import { useHistory, useParams } from 'react-router-dom'
import AutosizeTextarea from 'react-textarea-autosize'
import React from 'react'

import { directionsUrl, mapUrl } from '../lib/util'
import { fieldsStore } from '../fields/fields-store'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { housesApi } from '../lib/api'
import { housesStore } from '../houses/houses-store'
import * as backHistory from '../lib/back-history'

import { Header } from '../app/header'
import { HouseInfo } from './house-info'
import { Icon } from '../lib/icon'
import { Loader } from '../loader/loader'

const Input = (props) => <input {...props} />

const update = (house, props) => {
  props.id = house.get('id')

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

export const House = observer(({ house }) => {
  const params = useParams()
  const id = house?.id || params.id
  const history = useHistory()

  if (!house) {
    house = housesStore.getHouseById(id)
  }

  const archive = () => {
    update(house, { archived: !house.get('archived') })
  }

  const remove = (e) => {
    e.preventDefault()

    if (confirm('Remove this house?')) {
      housesApi.remove(house.get('id'))
      history.push(backHistory.pop())
    }
  }

  return (
    <div className='house'>
      <Header />
      <main>
        <form onSubmit={onSubmit}>
          <input
            className={HOUSE_NAME_KEY}
            value={house.get(HOUSE_NAME_KEY) || ''}
            onChange={_.partial(onChange, house, HOUSE_NAME_KEY)}
          />
          <HouseInfo house={house} />
          <div className='links'>
            <ul>
              {fieldsStore.linkFields
              .filter((field) => !!house.get(field.id))
              .map((field) => (
                <li key={field.id}>
                  <a
                    href={house.get(field.id)}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icon icon={faLaptopHouse}>View on {field.label}</Icon>
                  </a>
                </li>
              ))}
            </ul>
            <ul>
              <li>
                <a
                  href={mapUrl(house.get(HOUSE_NAME_KEY))}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Icon icon={faMapMarkedAlt}>View On Map</Icon>
                </a>
              </li>
              <li>
                <a
                  href={directionsUrl(house.get(HOUSE_NAME_KEY))}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Icon icon={faRoute}>Driving Directions</Icon>
                </a>
              </li>
            </ul>
          </div>
          <Fields house={house} />
          <button className='archive' onClick={archive}>
            <Icon icon={faArchive}>{house.get('archived') ? 'Unarchive' : 'Archive'}</Icon>
          </button>
          <button className='remove' onClick={remove}>
            <Icon icon={faTrashAlt}>Remove</Icon>
          </button>
        </form>
      </main>
    </div>
  )
})
