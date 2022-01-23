import { action, observable } from 'mobx'

export class ArchiveModel {
  @observable id
  @observable isCurrent = false
  @observable name = ''

  constructor ({ id, isCurrent, name }) {
    this.id = id
    this.update({ isCurrent, name })
  }

  @action update ({ isCurrent, name }) {
    if (isCurrent != null) this.isCurrent = isCurrent

    if (name != null) this.name = name
  }

  serialize () {
    return {
      id: this.id,
      isCurrent: this.isCurrent,
      name: this.name,
    }
  }
}
