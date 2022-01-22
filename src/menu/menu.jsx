import { faMap } from '@fortawesome/free-regular-svg-icons'
import { faArchive, faCogs, faColumns, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import { auth } from '../auth/auth'
import { housesApi } from '../lib/api'
import { HousesList } from '../houses/houses-list'
import { Icon } from '../lib/icon'
import { MenuGroup } from './menu-group'
import { housesStore } from '../houses/houses-store'

export const Menu = observer(() => {
  const history = useHistory()
  const state = useLocalStore(() => ({
    addingHouse: false,
    setAddingHouse (adding) {
      state.addingHouse = adding
    },
  }))

  const addHouse = (e) => {
    e.preventDefault()

    state.setAddingHouse(true)

    housesApi.add(action((id) => {
      housesStore.addHouse({ id })
      state.setAddingHouse(false)
      history.push(`/houses/${id}`)
    }))
  }

  const logout = (e) => {
    e.preventDefault()

    if (!confirm('Log out?')) return

    auth.logout()
    history.push('/login')
  }

  return (
    <ul className='menu full-screen'>
      <MenuGroup>
        <li className='houses-link'>
          <Link to='houses'>
            <Icon icon={faColumns}>Compare houses</Icon>
          </Link>
        </li>
        <li>
          <Link to='map'>
            <Icon icon={faMap}>Map</Icon>
          </Link>
        </li>
      </MenuGroup>
      <HousesList dataKey='houses' />
      <MenuGroup>
        <li>
          <a onClick={addHouse} href='#'>
            <Icon icon={faPlus}>Add house</Icon>
          </a>
        </li>
      </MenuGroup>
      <MenuGroup>
        {!!housesStore.archivedHouses.length &&
          <li>
            <Link to='archived-houses'>
              <Icon icon={faArchive}>Archived houses</Icon>
            </Link>
          </li>
        }
        <li>
          <Link to='settings'>
            <Icon icon={faCogs}>Settings</Icon>
          </Link>
        </li>
      </MenuGroup>
      <MenuGroup>
        <li>
          <a onClick={logout} href='#'>
            <Icon icon={faSignOutAlt}>Log out</Icon>
          </a>
        </li>
      </MenuGroup>
    </ul>
  )
})
