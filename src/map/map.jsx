import _ from 'lodash'
import { faHome, faRoute } from '@fortawesome/free-solid-svg-icons'
import { action, observable } from 'mobx'
import { Link } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import cs from 'classnames'
import GoogleMapReact from 'google-map-react'
import React from 'react'

import { directionsUrl } from '../lib/util'
import { HOUSE_NAME_KEY } from '../lib/constants'
import { housesStore } from '../houses/houses-store'
import { settingsStore } from '../settings/settings-store'

import { Header } from '../app/header'
import { Icon } from '../lib/icon'

class MarkerModel {
  @observable id
  @observable house
  @observable lat
  @observable lng

  constructor (house) {
    this.id = house.id
    this.house = house
  }

  @action setLatLng ({ lat, lng }) {
    this.lat = lat
    this.lng = lng
  }
}

const Marker = observer(({ marker, $hover, isClicked }) => {
  const { house } = marker
  const [address1, address2] = house.get(HOUSE_NAME_KEY)
  .replace(/,/, '<<BREAK>>')
  .split('<<BREAK>>')
  const visit = house.get(settingsStore.get('visitField'))

  return (
    <div className={cs('marker', { hover: $hover, clicked: isClicked })}>
      <div className='info'>
        <svg className='arrow' xmlns='http://www.w3.org/2000/svg' version='1.1'>
          <polygon points='0,0 20,0 10,10' />
        </svg>
        <h2>{address1}<br />{address2}</h2>
        {visit && <p>{visit}</p>}
        <p>
          <Link to={`/houses/${house.id}`}>
            <Icon icon={faHome}>View</Icon>
          </Link>
        </p>
        <p>
          <a
            href={`${directionsUrl(house.get(HOUSE_NAME_KEY))}`}
            target='_blank'
            rel='noreferrer'
          >
            <Icon icon={faRoute}>Directions</Icon>
          </a>
        </p>
      </div>
      <Icon icon={faHome} />
    </div>
  )
})

const getLatLng = (maps, address, cb) => {
  const geo = new maps.Geocoder()

  geo.geocode({ address }, (results, status) => {
    if (status === maps.GeocoderStatus.OK) {
      const location = results[0].geometry.location

      cb({ lat: location.lat(), lng: location.lng() })
    } else {
      // eslint-disable-next-line no-console
      console.log('failed to find', address, status)
    }
  })
}

export const Map = observer(() => {
  const defaultZoom = 10

  const state = useLocalStore(() => {
    const markers = _.map(housesStore.houses, (house) => (
      new MarkerModel(house)
    ))

    return {
      markers,
      clickedId: null,
      centerLat: 40.0755702,
      centerLng: -75.28691950000001,
      zoom: defaultZoom,
      setClicked (id, lat, lng) {
        state.clickedId = id
        state.centerLat = lat
        state.centerLng = lng
      },
      clearClickedId () {
        state.clickedId = null
      },
      setZoom (zoom) {
        state.zoom = zoom
      },
    }
  })

  const onGoogleApiLoaded = ({ maps }) => {
    _.each(state.markers, (marker) => {
      getLatLng(maps, marker.house.get(HOUSE_NAME_KEY), (location) => {
        marker.setLatLng(location)
      })
    })
  }

  // moves the marker down from center based on zoom (0-22) to make room
  // for the info window to fit in the viewport. there's probably an
  // equation for determining this, but i couldn't figure it out
  const adjustmets = [
    262.144,
    131.072,
    65.536,
    32.768,
    16.384,
    8.192,
    4.096,
    2.048,
    1.024,
    .512,
    .256,
    .128,
    .064,
    .032,
    .016,
    .008,
    .004,
    .002,
    .001,
    .0005,
    .00025,
    .000125,
    .00000625,
  ]

  const onMarkerClick = (key, childProps) => {
    state.setClicked(key, childProps.lat + adjustmets[state.zoom], childProps.lng)
  }

  const onBoundsChange = (center, zoom) => {
    state.setZoom(zoom)
  }

  const markers = _.filter(state.markers, (marker) => {
    return marker.lat != null
  })

  return (
    <div className='map full-screen'>
      <Header />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
        center={{ lat: state.centerLat, lng: state.centerLng }}
        defaultZoom={defaultZoom}
        onClick={state.clearClickedId}
        onChildClick={onMarkerClick}
        onBoundsChange={onBoundsChange}
        onGoogleApiLoaded={onGoogleApiLoaded}
        yesIWantToUseGoogleMapApiInternals
      >
        {_.map(markers, (marker) => (
          <Marker
            key={marker.id}
            marker={marker}
            isClicked={state.clickedId === marker.id}
            lat={marker.lat}
            lng={marker.lng}
          />
        ))}
      </GoogleMapReact>
    </div>
  )
})
