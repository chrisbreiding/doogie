import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './settings-actions';

class SettingsStore {
  constructor () {
    this.fields = [];

    this.bindListeners({
      onFieldAdded: actions.ADD_FIELD,
      onFieldUpdated: actions.UPDATE_FIELD,
      onFieldRemoved: actions.REMOVE_FIELD
    });
  }

  onFieldAdded (field) {
    this.fields.push(field);
  }

  onFieldUpdated (field) {
    const index = _.findIndex(this.fields, { id: field.id });
    this.fields[index] = field;
  }

  onFieldRemoved (field) {
    const index = _.findIndex(this.fields, { id: field.id });
    this.fields.splice(index, 1);
  }
}

export default createStore(SettingsStore, 'SettingsStore');
