import { faCogs, faSignOutAlt, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'

import { auth } from '../auth/auth'
import { fieldsStore } from '../fields/fields-store'
import { settingsApi } from '../lib/api'
import { settingsStore } from './settings-store'

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
    'Loan Limit',
    'Closing Rate',
    'Interest Rate',
    'Insurance Rate',
    'PMI Rate',
    'Mortgage Lengths',
    'Hypotheticals',
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
    'Asking Price Field',
    'Offer Price Field',
    'Zestimate Field',
    'Taxes Field',
    'Misc Upfront Costs Field',
    'Misc Monthly Costs Field',
    'Visit Field',
    // these are used for bookmarklet import from compass/zillow
    'Compass Link Field',
    'Cooling Field',
    'Heating Field',
    'House Size Field',
    'Lot Size Field',
    'Parking Field',
    'Rooms Field',
    'Sewer Field',
    'Water Source Field',
    'Year Field',
  ], (setting) => (
    <DropdownSetting key={setting} setting={setting} />
  ))
))

export const Settings = observer(() => {
  const navigate = useNavigate()

  const logout = (e) => {
    e.preventDefault()

    if (!confirm('Log out?')) return

    auth.logout()
    navigate('/login')
  }

  return (<>
    <div className='settings'>
      <Header>
        <h1><Icon icon={faCogs}>Settings</Icon></h1>
      </Header>
      <main>
        <ul className='menu'>
          <MenuGroup>
            <li>
              <Link to='fields'>
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
    <Outlet />
  </>)
})
