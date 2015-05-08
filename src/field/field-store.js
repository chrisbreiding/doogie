import _ from 'lodash';
import { createStore } from '../lib/dispatcher';
import actions from './field-actions';

class FieldStore {
  constructor () {
    this.field = null;

    this.bindListeners({
      onUpdate: actions.DID_UPDATE
    });
  }

  onUpdate (field) {
    this.field = field;
  }
}

export default createStore(FieldStore, 'FieldStore');
