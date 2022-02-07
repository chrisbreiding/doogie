import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { observer } from 'mobx-react'
import { render } from 'react-dom'
import FastClick from 'fastclick'
import React, { useEffect } from 'react'

import { auth } from './auth/auth'
import { App } from './app/app'
import { Loader } from './loader/loader'
import { Login } from './auth/login'

new FastClick(document.body)

const Root = observer(() => {
  useEffect(() => {
    auth.listenForAuthChanges()
  }, [true])

  if (auth.isAuthenticating) {
    return <Loader />
  }

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='*' element={<App />} />
    </Routes>
  )
})

render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.getElementById('app'),
)
