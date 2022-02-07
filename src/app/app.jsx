import { observer, useLocalStore } from 'mobx-react'
import React, { useEffect } from 'react'
import { Redirect, Route, Routes, useNavigate } from 'react-router-dom'

import { auth } from '../auth/auth'
import { archivesStore } from '../archives/archives-store'
import { housesStore } from '../houses/houses-store'
import { fieldsStore } from '../fields/fields-store'
import { settingsStore } from '../settings/settings-store'
import { fieldsApi, housesApi, settingsApi, onLoad, offLoad, archivesApi } from '../lib/api'

import { AddHouse } from '../houses/add'
import { Archives } from '../archives/archives'
import { House } from '../house/house'
import { CompareHouses } from '../houses/compare'
import { Loader } from '../loader/loader'
import { Map } from '../map/map'
import { Menu } from '../menu/menu'
import { Settings } from '../settings/settings'
import { Archive } from '../archives/archive'
import { Fields } from '../fields/fields'
import { Field } from '../fields/field'

export const App = observer(() => {
  const state = useLocalStore(() => ({
    isLoading: true,
    setIsLoading (isLoading) {
      this.isLoading = isLoading
    },
  }))

  const navigate = useNavigate()

  useEffect(() => {
    const offAuthChange = auth.onAuthChange((isAuthenticated) => {
      if (!auth.isAuthenticating && !isAuthenticated) {
        navigate('/login')
      }
    })

    archivesApi.listen({
      onAdd: archivesStore.addArchive,
      onUpdate: archivesStore.updateArchive,
      onRemove: archivesStore.removeArchive,
    })
    housesApi.listen({
      onAdd: housesStore.addHouse,
      onUpdate: housesStore.updateHouse,
      onRemove: housesStore.removeHouse,
    })
    fieldsApi.listen({
      onAdd: fieldsStore.addField,
      onUpdate: fieldsStore.updateField,
      onRemove: fieldsStore.removeField,
    })
    settingsApi.listen({
      onAdd: settingsStore.updateSetting,
      onUpdate: settingsStore.updateSetting,
    })
    onLoad(() => {
      state.setIsLoading(false)
    })

    return () => {
      offAuthChange()
      archivesApi.stopListening()
      housesApi.stopListening()
      fieldsApi.stopListening()
      settingsApi.stopListening()
      offLoad()
    }
  }, [true])

  if (
    (!auth.isAuthenticating && !auth.isAuthenticated)
    || state.isLoading
  ) {
    return <Loader />
  }

  const HouseRoute = <Route path='houses/:houseId' element={<House />} />

  return (<>
    <Menu />

    <Routes>
      {HouseRoute}
      <Route path='add' element={<AddHouse />} />
      <Route path='settings' element={<Settings />}>
        <Route path='fields' element={<Fields />}>
          <Route path=':fieldId' element={<Field />} />
        </Route>
      </Route>
      <Route path='compare' element={<CompareHouses />}>
        {HouseRoute}
      </Route>
      <Route path='archives' element={<Archives />}>
        <Route path=':archiveId' element={<Archive />}>
          {HouseRoute}
        </Route>
      </Route>
      <Route path='map' element={<Map />}>
        {HouseRoute}
      </Route>
    </Routes>
  </>)
})
