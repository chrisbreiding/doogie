import _ from 'lodash'
import { action, observable } from 'mobx'

import { archivesStore } from '../archives/archives-store'

export class HouseModel {
  @observable house = observable.map({
    archiveId: null,
  })

  constructor (props) {
    this.update(props)
  }

  get id () {
    return this.house.get('id')
  }

  get archiveId () {
    const archiveId = this.house.get('archiveId')

    // archiveId could be stale & invalid if its archive was removed
    return archivesStore.has(archiveId) ? archiveId : null
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
