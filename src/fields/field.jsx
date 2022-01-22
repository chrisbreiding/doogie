import _ from 'lodash'
import { observer } from 'mobx-react'
import { useHistory, useParams } from 'react-router-dom'
import AutosizeTextarea from 'react-textarea-autosize'
import React, { useRef } from 'react'

import { DEFAULT_FIELD_TYPE } from '../lib/constants'
import { fieldsApi } from '../lib/api'
import { fieldsStore } from './fields-store'
import * as backHistory from '../lib/back-history'

import { Header } from '../app/header'
import { Loader } from '../loader/loader'

const Input = (props) => <input {...props} />

export const Field = observer(() => {
  const labelRef = useRef()
  const history = useHistory()

  const { id } = useParams()
  const field = fieldsStore.getFieldById(id)

  if (!field) return <Loader />

  const onSubmit = (e) => {
    e.preventDefault()
  }

  const remove = () => {
    if (confirm('Remove this field?')) {
      fieldsApi.remove(id)
      history.push(backHistory.pop())
    }
  }

  const onChange = (key, e) => {
    field.update({ [key]: e.target.value })
    fieldsApi.update(field.serialize())
  }

  const NotesField = field.type === 'textarea' ? AutosizeTextarea : Input

  return (
    <div className='field'>
      <Header />
      <main>
        <form onSubmit={onSubmit}>
          <fieldset>
            <label>Type</label>
            <select
              value={field.type || DEFAULT_FIELD_TYPE}
              onChange={_.partial(onChange, 'type')}
            >
              <option value='input'>Single</option>
              <option value='textarea'>Mult-line</option>
              <option value='link'>Link</option>
              <option value='heading'>Heading</option>
            </select>
          </fieldset>
          <fieldset>
            <label>Label</label>
            <input
              ref={labelRef}
              value={field.label || ''}
              onChange={_.partial(onChange, 'label')}
            />
          </fieldset>
          {field.type !== 'heading' &&
            <fieldset>
              <label>Default notes</label>
              <NotesField
                value={field.defaultNotes || ''}
                onChange={_.partial(onChange, 'defaultNotes')}
              />
            </fieldset>
          }
          <button className='remove' onClick={remove}>
            Remove Field
          </button>
        </form>
      </main>
    </div>
  )
})
