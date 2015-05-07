import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './settings-actions';

class SettingsStore {
  constructor () {
    this.fields = [];

    this.bindListeners({
      addField: actions.ADD_FIELD,
      updateField: actions.UPDATE_FIELD,
      removeField: actions.REMOVE_FIELD,
      clearData: actions.STOP_LISTENING
    });
  }

  addField (field) {
    this.fields.push(field);
  }

  updateField (field) {
    const index = _.findIndex(this.fields, { id: field.id });
    this.fields[index] = field;
  }

  removeField (field) {
    const index = _.findIndex(this.fields, { id: field.id });
    this.fields.splice(index, 1);
  }

  clearData () {
    this.fields = [];
  }
}

export default createStore(SettingsStore, 'SettingsStore');
