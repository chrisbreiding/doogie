import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './house-actions';

class HouseStore {
  constructor () {
    this.house = null;

    this.bindListeners({
      onUpdate: actions.UPDATE
    });
  }

  onUpdate (house) {
    this.house = house;
  }
}

export default createStore(HouseStore, 'HouseStore');
