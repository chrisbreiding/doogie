import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const fieldsRef = firebaseRef.child('settings/fields');

class SettingsActions {
  addField (field) {
    this.dispatch(field);
  }

  updateField (field) {
    this.dispatch(field);
  }

  removeField (field) {
    this.dispatch(field);
  }

  updateSorting (ids) {
    _.each(ids, (id, index) => {
      fieldsRef.child(`${id}/order`).set(index);
    });
  }

  listen () {
    fieldsRef.on('child_added', (childSnapshot) => {
      this.actions.addField(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
    fieldsRef.on('child_changed', (childSnapshot) => {
      this.actions.updateField(_.extend({ id: childSnapshot.key() }, childSnapshot.val()));
    });
    fieldsRef.on('child_removed', (childSnapshot) => {
      this.actions.removeField({ id: childSnapshot.key() });
    });
  }

  stopListening () {
    this.dispatch();
    fieldsRef.off();
  }
}

export default createActions(SettingsActions);
