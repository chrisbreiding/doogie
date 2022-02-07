import { faMap } from '@fortawesome/free-regular-svg-icons'
import { faArchive, faCogs, faColumns, faPlus } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { housesApi } from '../lib/api'
import { HousesList } from '../houses/houses-list'
import { Icon } from '../lib/icon'
import { MenuGroup } from './menu-group'
import { housesStore } from '../houses/houses-store'

export const Menu = observer(() => {
  const navigate = useNavigate()
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
      navigate(`/houses/${id}`)
    }))
  }

  return (
    <ul className='menu full-screen'>
      <MenuGroup>
        <li>
          {housesStore.houses.length > 1 && (
            <Link to='compare'>
              <Icon icon={faColumns}>Compare houses</Icon>
            </Link>
          )}
        </li>
        <li>
          <Link to='map'>
            <Icon icon={faMap}>Map</Icon>
          </Link>
        </li>
      </MenuGroup>
      <HousesList houses={housesStore.houses} />
      <MenuGroup>
        <li>
          <a onClick={addHouse} href='#'>
            <Icon icon={faPlus}>Add house</Icon>
          </a>
        </li>
      </MenuGroup>
      <MenuGroup>
        <li>
          <Link to='archives'>
            <Icon icon={faArchive}>Archives</Icon>
          </Link>
        </li>
        <li>
          <Link to='settings'>
            <Icon icon={faCogs}>Settings</Icon>
          </Link>
        </li>
      </MenuGroup>
    </ul>
  )
})
