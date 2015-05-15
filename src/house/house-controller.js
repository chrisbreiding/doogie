import _ from 'lodash';
import { createFactory, createClass, PropTypes } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import houseActions from './house-actions';
import FieldsStore from '../fields/fields-store';
import fieldsActions from '../fields/fields-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import HouseComponent from './house';

const House = createFactory(HouseComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStores: {
      house: HouseStore,
      fields: FieldsStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    houseActions.listen(this._getId());
    fieldsActions.listen();
    settingsActions.listen();
  },

  componentDidUpdate (__, prevState) {
    const id = this._getId();
    if (!prevState.house.house || prevState.house.house.id === id) return;

    if (prevState.house.house.id) houseActions.stopListening(prevState.house.house.id);
    houseActions.listen(id);
  },

  _getId () {
    return this.props.id || this.context.router.getCurrentParams().id;
  },

  componentWillUnmount () {
    houseActions.stopListening(this.state.house.house.id);
    fieldsActions.stopListening();
    settingsActions.stopListening();
  },

  render () {
    return House(_.extend({
      onChange: this._onChange,
      onRemove: this._onRemove
    }, this.state));
  },

  _onChange (key, value) {
    houseActions.update({ id: this.state.house.house.id, [key]: value });
  },

  _onRemove () {
    houseActions.remove(this.state.house.house.id);
    this.context.router.transitionTo('menu');
  }
});
