import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import { fieldsRef } from '../lib/firebase-ref';

let _listenerCount = 0;

class FieldsActions {
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
    _listenerCount++;

    if (_listenerCount > 1) return;

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
    _listenerCount--;

    if (!_listenerCount) {
      this.dispatch();
      fieldsRef.off();
    }
  }
}

export default createActions(FieldsActions);
