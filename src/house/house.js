import _ from 'lodash';
import { createClass, PropTypes, DOM } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import houseActions from './house-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStores: {
      house: HouseStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    houseActions.listen(this._getId());
    settingsActions.listen();
    this._focusName();
  },

  componentDidUpdate (__, prevState) {
    const id = this._getId();
    if (!prevState.house.house || prevState.house.house.id === id) return;

    if (prevState.house.house.id) houseActions.stopListening(prevState.house.house.id);
    houseActions.listen(id);
    this._focusName();
  },

  _getId () {
    return this.context.router.getCurrentParams().id;
  },

  _focusName () {
    if (this.refs.name) this.refs.name.getDOMNode().focus();
  },

  componentWillUnmount () {
    houseActions.stopListening(this.state.house.house.id);
    settingsActions.stopListening();
  },

  render () {
    if (!this.state.house.house) return DOM.p(null, '...');

    const fields = [{ id: 'name', label: 'Name' }].concat(this.state.settings.fields);
    const inputs = _.map(fields, (field) => {
      const key = _.camelCase(field.label);

      return DOM.fieldset({ key: field.id, className: key },
        DOM.label(null, field.label),
        DOM.input({
          ref: key,
          value: this.state.house.house[key],
          onChange: _.partial(this._onChange, key)
        })
      );
    });

    return DOM.form(null, inputs);
  },

  _onChange (key) {
    houseActions.update(_.extend({}, this.state.house.house, {
      [key]: this.refs[key].getDOMNode().value
    }));
  }
});
