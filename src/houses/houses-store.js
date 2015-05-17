import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './houses-actions';

class HousesStore {
  constructor () {
    this.clearData();

    this.bindListeners({
      addHouse: actions.DID_ADD_HOUSE,
      updateHouse: actions.DID_UPDATE_HOUSE,
      removeHouse: actions.DID_REMOVE_HOUSE,
      clearData: actions.STOP_LISTENING
    });
  }

  addHouse (house) {
    if (house.order == null) {
      house.order = this._newOrder();
    }
    this._houses[house.id] = house;
    this._updateHouses();
  }

  updateHouse (house) {
    this._houses[house.id] = _.extend({}, this._houses[house.id], house);
    this._updateHouses();
  }

  removeHouse (house) {
    delete this._houses[house.id];
    this._updateHouses();
  }

  clearData () {
    this._houses = {};
    this.houses = [];
    this.archivedHouses = [];
  }

  _newOrder (orders) {
    var orders = _.map(this._houses, (house) => house.order || 0);
    if (!orders.length) return 0;
    return Math.max.apply(Math, orders);
  }

  _updateHouses () {
    this.houses = this._activeHouses();
    this.archivedHouses = this._archivedHouses();
  }

  _activeHouses () {
    return _(this._houses)
      .values()
      .filter((house) => !house.archived)
      .sortBy('order')
      .value();
  }

  _archivedHouses () {
    return _(this._houses)
      .values()
      .filter((house) => house.archived)
      .sortBy('order')
      .value();
  }
}

export default createStore(HousesStore, 'HousesStore');
