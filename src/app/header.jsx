import React from 'react'
import { useHistory } from 'react-router-dom'

import * as backHistory from '../lib/back-history'
import { Icon } from '../lib/icon'

export const Header = ({ children }) => {
  const history = useHistory()

  const goBack = (e) => {
    e.preventDefault()

    history.push(backHistory.pop())
  }

  return (
    <header>
      <a onClick={goBack} href='#'>
        <Icon name='chevron-left'>Back</Icon>
      </a>
      <h1>{children}</h1>
    </header>
  )
}
