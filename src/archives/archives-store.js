import _ from 'lodash'
import { action, computed, observable, values } from 'mobx'

import { ArchiveModel } from './archive-model'

class ArchivesStore {
  @observable _archives = observable.map()

  @computed get archives () {
    return values(this._archives).sort((a, b) => b.name - a.name)
  }

  @computed get current () {
    const current = this.archives.find((archive) => archive.isCurrent)

    return current || this.archives[0]
  }

  has (id) {
    return this._archives.has(id)
  }

  getArchiveById (id) {
    return this._archives.get(id)
  }

  resetCurrent () {
    this._archives.forEach(action((archive) => {
      archive.update({ isCurrent: false })
    }))
  }

  addArchive = action((props) => {
    const archive = new ArchiveModel(props)

    this._archives.set(archive.id, archive)
  })

  updateArchive = action((props) => {
    this._archives.get(props.id).update(props)
  })

  removeArchive = action(({ id }) => {
    this._archives.delete(id)
  })
}

export const archivesStore = new ArchivesStore()
