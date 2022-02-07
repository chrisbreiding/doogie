import { action } from 'mobx'
import React, { useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { housesApi } from '../lib/api'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { Loader } from '../loader/loader'
import { settingsStore } from '../settings/settings-store'
import { housesStore } from './houses-store'

const useQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export const AddHouse = () => {
  const query = useQuery()
  const navigate = useNavigate()

  useEffect(() => {
    const houseData = {
      [HOUSE_NAME_KEY]: query.get('address'),
      [settingsStore.get('costField')]: query.get('cost'),
      [settingsStore.get('taxesField')]: query.get('taxes'),
      [settingsStore.get('roomsField')]: query.get('rooms'),
      [settingsStore.get('houseSizeField')]: query.get('houseSize'),
      [settingsStore.get('lotSizeField')]: query.get('lotSize'),
      [settingsStore.get('coolingField')]: query.get('cooling'),
      [settingsStore.get('heatingField')]: query.get('heating'),
      [settingsStore.get('sewerField')]: query.get('sewer'),
      [settingsStore.get('waterSourceField')]: query.get('waterSource'),
      [settingsStore.get('yearBuiltField')]: query.get('yearBuilt'),
      [settingsStore.get('compassLinkField')]: query.get('compassLink'),
    }

    housesApi.addWithData(houseData, action((id) => {
      housesStore.addHouse({ ...houseData, id })
      navigate(`/houses/${id}`)
    }))
  }, [true])

  return (
    <div className='full-screen'>
      <Loader>Adding house...</Loader>
    </div>
  )
}
