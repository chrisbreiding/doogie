import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const housesRef = firebaseRef.child('houses');

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
