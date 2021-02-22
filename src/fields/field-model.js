import _ from 'lodash'
import { action, observable } from 'mobx'

import { DEFAULT_FIELD_TYPE } from '../lib/constants'

export class FieldModel {
  @observable type = DEFAULT_FIELD_TYPE
  @observable label
  @observable order
  @observable defaultNotes = ''
  @observable id

  constructor (props) {
    this.update(props)
  }

  @action update (props) {
    _.each(props, (value, prop) => {
      this[prop] = value
    })
  }

  serialize () {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      order: this.order,
      defaultNotes: this.defaultNotes,
    }
  }
}
