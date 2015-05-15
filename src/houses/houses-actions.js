import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import { housesRef } from '../lib/firebase-ref';

let _listenerCount = 0;

class HousesActions {
  didAddHouse (house) {
    this.dispatch(house);
  }

  didUpdateHouse (house) {
    this.dispatch(house);
  }

  didRemoveHouse (house) {
    this.dispatch(house);
  }

  updateHouse (house) {
    housesRef.child(house.id).update(_.omit(house, 'id'));
  }

  removeHouse (id) {
    housesRef.child(id).remove();
  }

  updateSorting (ids) {
    _.each(ids, (id, order) => {
      housesRef.child(id).update({ order });
    });
  }

  listen () {
    _listenerCount++;

    if (_listenerCount > 1) return;

    housesRef.on('child_added', (childSnapshot) => {
      this.actions.didAddHouse(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
    housesRef.on('child_changed', (childSnapshot) => {
      this.actions.didUpdateHouse(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
    housesRef.on('child_removed', (childSnapshot) => {
      this.actions.didRemoveHouse({ id: childSnapshot.key() });
    });
  }

  stopListening () {
    _listenerCount--;

    if (!_listenerCount) {
      this.dispatch();
      housesRef.off();
    }
  }
}

export default createActions(HousesActions);
