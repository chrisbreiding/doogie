import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Link } from 'react-router-dom'

import { Icon } from '../lib/icon'

export const Header = ({ children }) => {
  return (
    <header>
      <Link className='back' to='..'>
        <Icon icon={faChevronLeft}>Back</Icon>
      </Link>
      {children || <h1>&nbsp;</h1>}
    </header>
  )
}
