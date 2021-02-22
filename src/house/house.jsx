import _ from 'lodash'
import { observer } from 'mobx-react'
import { useHistory, useParams } from 'react-router-dom'
import AutosizeTextarea from 'react-textarea-autosize'
import React from 'react'

import { directionsUrl } from '../lib/util'
import { fieldsStore } from '../fields/fields-store'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { housesApi } from '../lib/api'
import { housesStore } from '../houses/houses-store'
import { settingsStore } from '../settings/settings-store'
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
        <label>{field.label}</label>
        <TextField
          value={value != null ? value : field.defaultNotes}
          onChange={_.partial(onChange, house, field.id)}
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

  const zillowLink = house.get(settingsStore.get('zillowLinkField'))

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
          {zillowLink &&
            <a
              className='link'
              href={zillowLink}
              target='_blank'
              rel='noreferrer'
            >
              <Icon name='home'>View on Zillow</Icon>
            </a>
          }
          <a href={directionsUrl(house.get(HOUSE_NAME_KEY))} className='link'>
            <Icon name='car'>Driving Directions</Icon>
          </a>
          <Fields house={house} />
          <button className='archive' onClick={archive}>
            <Icon name='archive'>{house.get('archived') ? 'Unarchive' : 'Archive'}</Icon>
          </button>
          <button className='remove' onClick={remove}>
            <Icon name='remove'>Remove</Icon>
          </button>
        </form>
      </main>
    </div>
  )
})
