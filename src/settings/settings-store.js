import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './settings-actions';

class SettingsStore {
  constructor () {
    this.clearData();

    this.bindListeners({
      addField: actions.ADD_FIELD,
      updateField: actions.UPDATE_FIELD,
      removeField: actions.REMOVE_FIELD,
      clearData: actions.STOP_LISTENING
    });
  }

  addField (field) {
    field.order = this._newOrder();
    this._fields[field.id] = field;
    this._updateFields();
  }

  updateField (field) {
    this._fields[field.id] = field;
    this._updateFields();
  }

  removeField (field) {
    delete this._fields[field.id];
    this._updateFields();
  }

  clearData () {
    this._fields = {};
    this.fields = [];
  }

  _updateFields () {
    this.fields = this._sortedFields();
  }

  _newOrder (orders) {
    var orders = _.map(this._fields, (field) => field.order || 0);
    if (!orders.length) return 0;
    return Math.max.apply(Math, orders);
  }

  _sortedFields () {
    return _(this._fields)
      .values()
      .sortBy('order')
      .value();
  }
}

export default createStore(SettingsStore, 'SettingsStore');
