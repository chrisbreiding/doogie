import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './houses-actions';

class HousesStore {
  constructor () {
    this.houses = [];

    this.bindListeners({
      addHouse: actions.ADD_HOUSE,
      updateHouse: actions.UPDATE_HOUSE,
      removeHouse: actions.REMOVE_HOUSE,
      clearData: actions.STOP_LISTENING
    });
  }

  addHouse (house) {
    this.houses.push(house);
  }

  updateHouse (house) {
    const index = _.findIndex(this.houses, { id: house.id });
    this.houses[index] = house;
  }

  removeHouse (house) {
    const index = _.findIndex(this.houses, { id: house.id });
    this.houses.splice(index, 1);
  }

  clearData () {
    this.houses = [];
  }
}

export default createStore(HousesStore, 'HousesStore');
