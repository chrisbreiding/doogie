import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './settings-actions';

class SettingsStore {
  constructor () {
    this.fields = {};

    this.bindListeners({
      addField: actions.ADD_FIELD,
      updateField: actions.UPDATE_FIELD,
      removeField: actions.REMOVE_FIELD,
      clearData: actions.STOP_LISTENING
    });
  }

  addField (field) {
    field.order = this._newOrder();
    this.fields[field.id] = field;
  }

  updateField (field) {
    this.fields[field.id] = field;
  }

  removeField (field) {
    delete this.fields[field.id];
  }

  clearData () {
    this.fields = {};
  }

  _newOrder (orders) {
    var orders = _.map(this.fields, (field) => field.order || 0);
    if (!orders.length) return 0;
    return Math.max.apply(Math, orders);
  }
}

export default createStore(SettingsStore, 'SettingsStore');
