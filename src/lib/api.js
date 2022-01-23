import _ from 'lodash'

import { firebaseRef } from './firebase'
import { HOUSE_NAME_KEY } from './constants'

const makeApi = (path, additionKey) => {
  const ref = firebaseRef.child(path)

  return {
    updateSorting (ids) {
      _.each(ids, (id, order) => {
        ref.child(id).update({ order })
      })
    },

    listen (callbacks) {
      callbacks = _.defaults(callbacks, {
        onLoad () {},
        onAdd () {},
        onUpdate () {},
        onRemove () {},
      })

      const getProps = (snapshot) => {
        const value = snapshot.val()
        const props = _.isObject(value) ? value : { value }

        return _.extend({ id: snapshot.key }, props)
      }

      ref.on('value', () => {
        callbacks.onLoad()
      })
      ref.on('child_added', (snapshot) => {
        callbacks.onAdd(getProps(snapshot))
      })
      ref.on('child_changed', (snapshot) => {
        callbacks.onUpdate(getProps(snapshot))
      })
      ref.on('child_removed', (snapshot) => {
        callbacks.onRemove({ id: snapshot.key })
      })
    },

    stopListening () {
      ref.off()
    },

    add (onAdd) {
      const newRef = ref.push({ [additionKey]: '' }, () => {
        onAdd(newRef.key)
      })
    },

    update (props) {
      if (path === 'settings') {
        ref.update(props)

        return
      }

      ref.child(props.id).update(_.omit(props, 'id'))
    },

    remove (id) {
      ref.child(id).remove()
    },
  }
}

export const archivesApi = makeApi('archives', 'name')

export const fieldsApi = makeApi('fields', 'label')

export const housesApi = makeApi('houses', HOUSE_NAME_KEY)

export const settingsApi = makeApi('settings')

export const onLoad = (cb) => {
  firebaseRef.on('value', cb)
}

export const offLoad = () => {
  firebaseRef.off('value')
}
