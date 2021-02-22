import _ from 'lodash'
import { observer, useLocalStore } from 'mobx-react'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'

import { auth } from '../auth/auth'
import { housesStore } from '../houses/houses-store'
import { fieldsStore } from '../fields/fields-store'
import { settingsStore } from '../settings/settings-store'
import { fieldsApi, housesApi, settingsApi, onLoad, offLoad } from '../lib/api'

import { ArchivedHouses } from '../houses/archived-houses'
import { House } from '../house/house'
import { Houses } from '../houses/houses'
import { Loader } from '../loader/loader'
import { Map } from '../map/map'
import { Menu } from '../menu/menu'
import { Settings } from '../settings/settings'
import { isStandalone } from '../lib/util'
import * as backHistory from '../lib/back-history'

const updateBackHistory = (pathname, action) => {
  if (_.includes(['/', '/login'], pathname)) {
    backHistory.clear()

    return
  }

  // this is a redirect for standalone, don't push or there will
  // it will be duplicated
  if (action === 'REPLACE') return

  backHistory.push(pathname)
}

const updateSavedRoute = (pathname) => {
  // only redirect to saved route on a standalone installation
  // otherwise, there's a url bar for that sake
  if (!isStandalone()) return

  // never want to redirect to login
  if (pathname === '/login') return

  localStorage.savedRoute = pathname
}

export const App = observer(() => {
  const state = useLocalStore(() => ({
    isLoading: true,
    setIsLoading (isLoading) {
      this.isLoading = isLoading
    },
  }))

  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    const offAuthChange = auth.onAuthChange((isAuthenticated) => {
      if (!auth.isAuthenticating && !isAuthenticated) {
        history.push('/login')
      }
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

    const stopListeningToHistory = history.listen(({ pathname }, action) => {
      updateBackHistory(pathname, action)
      updateSavedRoute(pathname)
    })

    if (localStorage.savedRoute && location.pathname !== localStorage.savedRoute) {
      history.replace(localStorage.savedRoute)
    }

    return () => {
      offAuthChange()
      housesApi.stopListening()
      fieldsApi.stopListening()
      settingsApi.stopListening()
      offLoad()
      stopListeningToHistory()
    }
  }, [true])

  if (!auth.isAuthenticating && !auth.isAuthenticated) {
    return <Redirect to='/login' />
  }

  if (state.isLoading) return <Loader />

  return (<>
    <Menu />

    <Switch>
      <Route path='/settings' component={Settings} />
      <Route exact path='/houses' component={Houses} />
      <Route path='/archived-houses' component={ArchivedHouses} />
      <Route path='/houses/:id' component={House} />
      <Route path='/map' component={Map} />
    </Switch>
  </>)
})
