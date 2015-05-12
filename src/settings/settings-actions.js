import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import firebaseRef from '../lib/firebase-ref';

const settingsRef = firebaseRef.child('settings');

class SettingsActions {
  updateSetting (key, value) {
    settingsRef.child(key).set(value);
  }

  didUpdateSetting (key, value) {
    this.dispatch({ key, value });
  }

  listen () {
    settingsRef.on('child_added', (childSnapshot) => {
      this.actions.didUpdateSetting(childSnapshot.key(), childSnapshot.val());
    });
    settingsRef.on('child_changed', (childSnapshot) => {
      this.actions.didUpdateSetting(childSnapshot.key(), childSnapshot.val());
    });
  }

  stopListening () {
    settingsRef.off();
  }
}

export default createActions(SettingsActions);
