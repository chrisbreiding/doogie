import _ from 'lodash'
import { action, observable } from 'mobx'

export class HouseModel {
  @observable house = observable.map({
    archived: false,
  })

  constructor (props) {
    this.update(props)
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
