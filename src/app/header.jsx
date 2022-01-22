import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
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
      <a className='back' onClick={goBack} href='#'>
        <Icon icon={faChevronLeft}>Back</Icon>
      </a>
      <h1>{children}</h1>
    </header>
  )
}
