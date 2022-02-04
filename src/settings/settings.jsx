import { faCogs, faSignOutAlt, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import { Link, Route, useRouteMatch } from 'react-router-dom'
import { observer } from 'mobx-react'
import React from 'react'

import { auth } from '../auth/auth'
import { fieldsStore } from '../fields/fields-store'
import { settingsApi } from '../lib/api'
import { settingsStore } from './settings-store'

import { Fields } from '../fields/fields'
import { Header } from '../app/header'
import { Icon } from '../lib/icon'
import { MenuGroup } from '../menu/menu-group'

const logout = (e) => {
  e.preventDefault()

  if (!confirm('Log out?')) return

  auth.logout()
  history.push('/login')
}

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
    // these are used for bookmarklet import from compass
    'Rooms Field',
    'House Size Field',
    'Lot Size Field',
    'Cooling Field',
    'Heating Field',
    'Sewer Field',
    'Water Source Field',
    'Year Field',
    'Compass Link Field',
  ], (setting) => (
    <DropdownSetting key={setting} setting={setting} />
  ))
))

export const Settings = observer(() => {
  const match = useRouteMatch()

  return (<>
    <div className='settings'>
      <Header>
        <h1><Icon icon={faCogs}>Settings</Icon></h1>
      </Header>
      <main>
        <ul className='menu'>
          <MenuGroup>
            <li>
              <Link to={`${match.url}/fields`}>
                <Icon icon={faSlidersH}>Fields</Icon>
              </Link>
            </li>
          </MenuGroup>
          <li>
            <TextSettings />
            <DropdownSettings />
          </li>
          <MenuGroup>
            <li>
              <a onClick={logout} href='#'>
                <Icon icon={faSignOutAlt}>Log out</Icon>
              </a>
            </li>
          </MenuGroup>
        </ul>
      </main>
    </div>
    <Route path={`${match.path}/fields`} component={Fields} />
  </>)
})
