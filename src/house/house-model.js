import _ from 'lodash'
import { action, computed, observable } from 'mobx'

import { archivesStore } from '../archives/archives-store'
import { HOUSE_NAME_KEY } from '../lib/constants'

export class HouseModel {
  @observable house = observable.map({
    archiveId: null,
  })

  constructor (props) {
    this.update(props)
  }

  @computed get id () {
    return this.house.get('id')
  }

  @computed get archiveId () {
    const archiveId = this.house.get('archiveId')

    // archiveId could be stale & invalid if its archive was removed
    return archivesStore.has(archiveId) ? archiveId : null
  }

  @computed get name () {
    return this.get(HOUSE_NAME_KEY)
  }

  @computed get address () {
    return this.name
  }

  @computed get shortName () {
    // 123 Street Rd, City, ST 12345 -> 123 Street Rd
    return this.name.split(/\s*,\s*/)[0]
  }

  @computed get addressLines () {
    // split on the first comma, so that:
    //   123 Street Rd, City, ST 12345
    // becomes:
    //   [
    //     '123 Street Rd',
    //     'City, ST 12345',
    //   ]
    return this.address.replace(/,/, '<<BREAK>>').split('<<BREAK>>')
  }

  @computed get city () {
    return this.addressLines[1]?.split(',')[0] || ''
  }

  get (key) {
    return this.house.get(key)
  }

  @action update (props) {
    _.each(props, (value, prop) => {
      this.house.set(prop, value)
    })
  }
}
