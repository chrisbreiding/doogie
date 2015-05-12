import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './settings-actions';

class SettingsStore {
  constructor () {
    _.extend(this, {
      downPayment: 0,
      interestRate: 0,
      insuranceRate: 0
    });

    this.bindListeners({
      updateSetting: actions.DID_UPDATE_SETTING
    });
  }

  updateSetting ({ key, value }) {
    this[key] = value;
  }
}

export default createStore(SettingsStore, 'SettingsStore');
