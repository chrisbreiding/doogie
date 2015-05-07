import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const housesRef = firebaseRef.child('houses');

class HouseActions {
  update (house) {
    housesRef.child(house.id).set(_.omit(house, 'id'));
    this.actions.didUpdate(house);
  }

  didUpdate (house) {
    this.dispatch(house);
  }

  add (cb) {
    const newRef = housesRef.push({ name: '' }, () => {
      cb(newRef.key());
    });
  }

  listen (id) {
    housesRef.child(id).on('value', (childSnapshot) => {
      this.actions.didUpdate(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
  }

  stopListening (id) {
    housesRef.child(id).off();
  }
}

export default createActions(HouseActions);
