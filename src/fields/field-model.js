import _ from 'lodash'
import { action, computed, observable } from 'mobx'

import { DEFAULT_FIELD_TYPE } from '../lib/constants'

export class FieldModel {
  @observable type = DEFAULT_FIELD_TYPE // input | textarea | link | heading
  @observable label
  @observable order
  @observable defaultNotes = ''
  @observable id

  constructor (props) {
    this.update(props)
  }

  @computed get displayLabel () {
    return this.type === 'link' ? `${this.label} Link` : this.label
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
