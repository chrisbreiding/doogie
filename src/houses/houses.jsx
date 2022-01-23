import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import { housesStore } from './houses-store'

import { Header } from '../app/header'
import { House } from '../house/house'

export const Houses = observer(() => (
  <div className='houses'>
    <Header />
    <main>
      <div className='container' style={{ width: `${housesStore.houses.length * 21.5}em` }}>
        {_.map(housesStore.houses, (house) => (
          <House key={house.id} house={house} />
        ))}
      </div>
    </main>
  </div>
))
