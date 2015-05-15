import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import { housesRef } from '../lib/firebase-ref';
import { HOUSE_NAME_KEY } from '../lib/constants';

class HouseActions {
  add (cb) {
    const newRef = housesRef.push({ [HOUSE_NAME_KEY]: '' }, () => {
      cb(newRef.key());
    });
  }

  update (house) {
    housesRef.child(house.id).update(_.omit(house, 'id'));
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
