import _ from 'lodash'
import { Link, Route, useRouteMatch } from 'react-router-dom'
import { observer } from 'mobx-react'
import React from 'react'

import { fieldsStore } from '../fields/fields-store'
import { settingsApi } from '../lib/api'
import { settingsStore } from './settings-store'

import { Fields } from '../fields/fields'
import { Header } from '../app/header'
import { Icon } from '../lib/icon'
import { MenuGroup } from '../menu/menu-group'

const onChange = (id, e) => {
  const value = e.target.value

  settingsStore.updateSetting({ id, value })
  settingsApi.update({ [id]: value })
}

const TextSetting = observer(({ setting }) => {
  const key = _.camelCase(setting)

  return (
    <fieldset>
      <label>{setting}</label>
      <input
        value={settingsStore.get(key)}
        onChange={_.partial(onChange, key)}
      />
    </fieldset>
  )
})

const TextSettings = observer(() => (
  _.map([
    'Max Upfront Cost',
    'Down Payment',
    'Closing Rate',
    'Interest Rate',
    'Insurance Rate',
    'PMI Rate',
    'Mortgage Lengths',
  ], (setting) => (
    <TextSetting key={setting} setting={setting} />
  ))
))

const DropdownSetting = observer(({ setting }) => {
  const key = _.camelCase(setting)

  return (
    <fieldset>
      <label>{setting}</label>
      <select value={settingsStore.get(key)} onChange={_.partial(onChange, key)}>
        {_.map(fieldsStore.fields, (field) => (
          <option key={field.id} value={field.id}>
            {field.displayLabel}
          </option>
        ))}
      </select>
    </fieldset>
  )
})

const DropdownSettings = observer(() => (
  _.map([
    'Cost Field',
    'Zestimate Field',
    'Taxes Field',
    'Misc Upfront Costs Field',
    'Misc Monthly Costs Field',
    'Visit Field',
    'Rooms Field',
    'Year Built Field',
    'A/C Field',
    'Heating Field',
  ], (setting) => (
    <DropdownSetting key={setting} setting={setting} />
  ))
))

export const Settings = observer(() => {
  const match = useRouteMatch()

  return (<>
    <div className='settings'>
      <Header>
        <Icon name='cog'>Settings</Icon>
      </Header>
      <main>
        <ul className='menu'>
          <MenuGroup>
            <li>
              <Link to={`${match.url}/fields`}>
                <Icon name='tasks'>Fields</Icon>
              </Link>
            </li>
          </MenuGroup>
          <li>
            <TextSettings />
            <DropdownSettings />
          </li>
        </ul>
      </main>
    </div>
    <Route path={`${match.path}/fields`} component={Fields} />
  </>)
})
