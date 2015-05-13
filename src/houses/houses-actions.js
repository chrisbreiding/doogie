import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import { housesRef } from '../lib/firebase-ref';

class HousesActions {
  addHouse (house) {
    this.dispatch(house);
  }

  updateHouse (house) {
    this.dispatch(house);
  }

  removeHouse (house) {
    this.dispatch(house);
  }

  updateSorting (ids) {
    _.each(ids, (id, index) => {
      housesRef.child(`${id}/order`).set(index);
    });
  }

  listen () {
    housesRef.on('child_added', (childSnapshot) => {
      this.actions.addHouse(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
    housesRef.on('child_changed', (childSnapshot) => {
      this.actions.updateHouse(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
    housesRef.on('child_removed', (childSnapshot) => {
      this.actions.removeHouse({ id: childSnapshot.key() });
    });
  }

  stopListening () {
    this.dispatch();
    housesRef.off();
  }
}

export default createActions(HousesActions);
