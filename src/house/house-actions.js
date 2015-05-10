import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const housesRef = firebaseRef.child('houses');

class HouseActions {
  add (cb) {
    const newRef = housesRef.push({ name: '' }, () => {
      cb(newRef.key());
    });
  }

  update (house) {
    housesRef.child(house.id).set(_.omit(house, 'id'));
    this.actions.didUpdate(house);
  }

  remove (id) {
    housesRef.child(id).remove();
  }

  didUpdate (house) {
    this.dispatch(house);
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
