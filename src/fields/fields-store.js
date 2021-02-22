import _ from 'lodash'
import { action, computed, observable, values } from 'mobx'
import { FieldModel } from './field-model'

class FieldsStore {
  @observable _fields = observable.map()

  @computed get fields () {
    return _.sortBy(values(this._fields), 'order')
  }

  @action updateSorting (ids) {
    _.each(ids, (id, order) => {
      this.getFieldById(id).update({ order })
    })
  }

  getFieldById (id) {
    return this._fields.get(id)
  }

  addField = (props) => {
    const field = new FieldModel(props)

    if (field.order == null) {
      field.order = this._newOrder()
    }

    this._fields.set(field.id, field)
  }

  updateField = (props) => {
    this._fields.get(props.id).update(props)
  }

  removeField = (field) => {
    this._fields.delete(field.id)
  }

  _newOrder () {
    const orders = _.map(values(this._fields), (field) => field.order || 0)

    if (!orders.length) return 0

    return Math.max(...orders)
  }
}

export const fieldsStore = new FieldsStore()
