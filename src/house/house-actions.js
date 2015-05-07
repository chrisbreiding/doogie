import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const housesRef = firebaseRef.child('houses');

class HouseActions {
  update (house) {
    this.dispatch(house);
  }

  listen (id) {
    housesRef.child(id).on('value', (childSnapshot) => {
      this.actions.update(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
  }

  stopListening (id) {
    housesRef.child(id).off();
  }
}

export default createActions(HouseActions);
