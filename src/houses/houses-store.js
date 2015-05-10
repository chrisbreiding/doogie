import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './houses-actions';

class HousesStore {
  constructor () {
    this.houses = {};

    this.bindListeners({
      addHouse: actions.ADD_HOUSE,
      updateHouse: actions.UPDATE_HOUSE,
      removeHouse: actions.REMOVE_HOUSE,
      clearData: actions.STOP_LISTENING
    });
  }

  addHouse (house) {
    house.order = this._newOrder();
    this.houses[house.id] = house;
  }

  updateHouse (house) {
    this.houses[house.id] = house;
  }

  removeHouse (house) {
    delete this.houses[house.id];
  }

  clearData () {
    this.houses = {};
  }

  _newOrder (orders) {
    var orders = _.map(this.houses, (house) => house.order || 0);
    if (!orders.length) return 0;
    return Math.max.apply(Math, orders);
  }
}

export default createStore(HousesStore, 'HousesStore');
