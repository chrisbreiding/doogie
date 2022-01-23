import { faArchive, faMapPin, faPlus } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'
import { Link, Route, useHistory, useRouteMatch } from 'react-router-dom'

import { archivesApi } from '../lib/api'
import { archivesStore } from './archives-store'
import { housesStore } from '../houses/houses-store'

import { Archive } from './archive'
import { Header } from '../app/header'
import { Icon } from '../lib/icon'
import { Loader } from '../loader/loader'
import { MenuGroup } from '../menu/menu-group'

const ArchiveItem = observer(({ archive, match }) => {
  const houses = housesStore.archivedHouses(archive.id)
  const label = houses.length === 1 ? ' house' : ' houses'

  return (
    <li className='archive-item'>
      <Link to={`${match.url}/${archive.id}`}>
        <Icon icon={faArchive}>{archive.name}</Icon>
        {archive.isCurrent && <Icon icon={faMapPin} />}
        <span className='spacer' />
        <span className='num-houses'>
          {houses.length}{label}
        </span>
      </Link>
    </li>
  )
})

export const Archives = observer(() => {
  const match = useRouteMatch()
  const history = useHistory()
  const state = useLocalStore(() => ({
    addingArchive: false,
    setAddingArchive (adding) {
      state.addingField = adding
    },
  }))

  const addArchive = () => {
    state.setAddingArchive(true)

    archivesApi.add(action((id) => {
      archivesStore.addArchive({ id })
      state.setAddingArchive(false)
      history.push(`${match.path}/${id}`)
    }))
  }

  if (state.addArchive) return <Loader />

  return (
    <>
      <div className='archives'>
        <Header>
          <h1><Icon icon={faArchive}>Archives</Icon></h1>
        </Header>
        <main>
          <ul className='menu'>
            <MenuGroup>
              {archivesStore.archives.map((archive) => (
                <ArchiveItem
                  key={archive.id}
                  archive={archive}
                  match={match}
                />
              ))}
            </MenuGroup>
            <MenuGroup>
              <li>
                <button onClick={addArchive}>
                  <Icon icon={faPlus}>Add Archive</Icon>
                </button>
              </li>
            </MenuGroup>
          </ul>
        </main>
      </div>
      <Route path={`${match.path}/:id`} component={Archive} />
    </>
  )
})
