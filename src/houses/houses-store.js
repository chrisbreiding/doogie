import _ from 'lodash'
import { action, computed, observable, values } from 'mobx'

import { HouseModel } from '../house/house-model'

class HousesStore {
  @observable _houses = observable.map()

  @computed get houses () {
    return _(values(this._houses))
    .filter((house) => !house.archiveId)
    .sortBy((house) => house.get('order'))
    .value()
  }

  @action updateSorting (ids) {
    _.each(ids, (id, order) => {
      this.getHouseById(id).update({ order })
    })
  }

  archivedHouses (archiveId) {
    return _(values(this._houses))
    .filter((house) => house.get('archiveId') === archiveId)
    .sortBy((house) => house.get('order'))
    .value()
  }

  getHouseById (id) {
    return this._houses.get(id)
  }

  addHouse = (props) => {
    const house = new HouseModel(props)

    if (house.get('order') == null) {
      house.update({ order: this._newOrder() })
    }

    this._houses.set(house.id, house)
  }

  updateHouse = (props) => {
    this._houses.get(props.id).update(props)
  }

  removeHouse = ({ id }) => {
    this._houses.delete(id)
  }

  _newOrder () {
    const orders = _.map(this.houses, (house) => (
      house.get('order') || 0
    ))

    if (!orders.length) return 0

    return Math.max(...orders)
  }
}

export const housesStore = new HousesStore()
