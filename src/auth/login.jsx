import { observer, useLocalStore } from 'mobx-react'
import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { auth } from './auth'

import { Loader } from '../loader/loader'
import { Icon } from '../lib/icon'

export const Login = observer(() => {
  const state = useLocalStore(() => ({
    attemptingLogin: false,
    loginFailed: false,
    setAttemptingLogin (attemptingLogin) {
      state.attemptingLogin = attemptingLogin
    },
    setLoginFailed (loginFailed) {
      state.loginFailed = loginFailed
    },
  }))

  const history = useHistory()

  const emailRef = useRef()
  const passwordRef = useRef()

  const onSubmit = (e) => {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    state.setAttemptingLogin(true)
    auth.login(email, password).then((didSucceed) => {
      if (didSucceed) {
        history.push('/')
      } else {
        state.setAtttemptingLogin(false)
        state.setLoginFailed(true)
      }
    })
  }

  return (
    <div>
      <header>
        <h1>Please Log In</h1>
      </header>
      <main>
        <form className='login' onSubmit={onSubmit}>
          <label>Email</label>
          <input ref={emailRef} type='email' />
          <label>Password</label>
          <input ref={passwordRef} type='password' />
          {state.loginFailed && <p className='error'>Login failed. Please try again.</p>}
          {state.attemptingLogin ?
            <Loader size='regular' /> :
            <button>
              <Icon name='sign-in'>Log In</Icon>
            </button>
          }
        </form>
      </main>
    </div>
  )
})
