import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './houses-actions';

class HousesStore {
  constructor () {
    this.clearData();

    this.bindListeners({
      addHouse: actions.ADD_HOUSE,
      updateHouse: actions.UPDATE_HOUSE,
      removeHouse: actions.REMOVE_HOUSE,
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
    this._houses[house.id] = house;
    this._updateHouses();
  }

  removeHouse (house) {
    delete this._houses[house.id];
    this._updateHouses();
  }

  clearData () {
    this._houses = {};
    this.houses = [];
  }

  _newOrder (orders) {
    var orders = _.map(this._houses, (house) => house.order || 0);
    if (!orders.length) return 0;
    return Math.max.apply(Math, orders);
  }

  _updateHouses () {
    this.houses = this._sortedHouses();
  }

  _sortedHouses () {
    return _(this._houses)
      .values()
      .sortBy('order')
      .value();
  }
}

export default createStore(HousesStore, 'HousesStore');
