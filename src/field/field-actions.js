import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const fieldsRef = firebaseRef.child('settings/fields');

class fieldActions {
  add (cb) {
    const newRef = fieldsRef.push({ label: '' }, () => {
      cb(newRef.key());
    });
  }

  update (field) {
    fieldsRef.child(field.id).set(_.omit(field, 'id'));
    this.actions.didUpdate(field);
  }

  remove (id) {
    fieldsRef.child(id).remove();
  }

  didUpdate (field) {
    this.dispatch(field);
  }

  listen (id) {
    fieldsRef.child(id).on('value', (childSnapshot) => {
      this.actions.didUpdate(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
  }

  stopListening (id) {
    fieldsRef.child(id).off();
  }
}

export default createActions(fieldActions);
