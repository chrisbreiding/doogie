import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useHistory } from 'react-router-dom'

import * as backHistory from '../lib/back-history'
import { Icon } from '../lib/icon'

export const Header = ({ children, onBack }) => {
  const history = useHistory()

  const goBack = (e) => {
    e.preventDefault()

    onBack && onBack()

    history.push(backHistory.pop())
  }

  return (
    <header>
      <a className='back' onClick={goBack} href='#'>
        <Icon icon={faChevronLeft}>Back</Icon>
      </a>
      {children || <h1>&nbsp;</h1>}
    </header>
  )
}
