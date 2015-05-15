import _ from 'lodash';
import { createActions } from '../lib/dispatcher';
import { settingsRef } from '../lib/firebase-ref';

let _listenerCount = 0;

class SettingsActions {
  updateSetting (key, value) {
    settingsRef.child(key).set(value);
  }

  didUpdateSetting (key, value) {
    this.dispatch({ key, value });
  }

  listen () {
    _listenerCount++;

    if (_listenerCount > 1) return;

    settingsRef.on('child_added', (childSnapshot) => {
      this.actions.didUpdateSetting(childSnapshot.key(), childSnapshot.val());
    });
    settingsRef.on('child_changed', (childSnapshot) => {
      this.actions.didUpdateSetting(childSnapshot.key(), childSnapshot.val());
    });
  }

  stopListening () {
    _listenerCount--;

    if (!_listenerCount) {
      settingsRef.off();
    }
  }
}

export default createActions(SettingsActions);
