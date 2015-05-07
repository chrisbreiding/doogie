import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './houses-actions';

class HousesStore {
  constructor () {
    this.houses = [];

    this.bindListeners({
      onHouseAdded: actions.ADD_HOUSE,
      onHouseUpdated: actions.UPDATE_HOUSE,
      onHouseRemoved: actions.REMOVE_HOUSE
    });
  }

  onHouseAdded (house) {
    this.houses.push(house);
  }

  onHouseUpdated (house) {
    const index = _.findIndex(this.houses, { id: house.id });
    this.houses[index] = house;
  }

  onHouseRemoved (house) {
    const index = _.findIndex(this.houses, { id: house.id });
    this.houses.splice(index, 1);
  }
}

export default createStore(HousesStore, 'HousesStore');
