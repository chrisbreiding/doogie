import { faHome } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import { fieldsStore } from '../fields/fields-store'
import { housesStore } from './houses-store'
import { HOUSE_NAME_KEY } from '../lib/constants'

import { Header } from '../app/header'
import { HouseInfo } from '../house/house-info'
import { Icon } from '../lib/icon'
import { NoHouses } from './no-houses'

const Content = observer(() => {
  if (!housesStore.houses.length) {
    return <NoHouses />
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {_.map(housesStore.houses, (house) => (
            <th key={house.id}>{house.get(HOUSE_NAME_KEY)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='field-label'></td>
          {_.map(housesStore.houses, (house) => (
            <td key={house.id}>
              <Link to={`houses/${house.id}`}>
                <Icon icon={faHome}>View House</Icon>
              </Link>
              <HouseInfo house={house} />
            </td>
          ))}
        </tr>
        {_.map(fieldsStore.valueFields, (field, i) => {
          return (
            <tr key={field.id} className={`row-${i % 2 === 0 ? 'odd' : 'even'}`}>
              <td className='field-label'>{field.label}</td>
              {_.map(housesStore.houses, (house) => (
                <td key={`${field.id}${house.id}`}>{house.get(field.id)}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
})

export const CompareHouses = observer(() => (
  <>
    <div className='compare'>
      <Header />
      <main>
        <Content />
      </main>
    </div>
    <Outlet />
  </>
))
