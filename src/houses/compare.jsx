import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import { fieldsStore } from '../fields/fields-store'
import { housesStore } from './houses-store'
import { HOUSE_NAME_KEY } from '../lib/constants'

import { Header } from '../app/header'
import { HouseInfo } from '../house/house-info'
import { Link } from 'react-router-dom'
import { Icon } from '../lib/icon'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export const CompareHouses = observer(() => (
  <div className='compare'>
    <Header />
    <main>
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
                <Link to={`/houses/${house.id}`}>
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
    </main>
  </div>
))
