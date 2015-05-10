import _ from 'lodash';
import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import houseActions from './house-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import { HOUSE_NAME_KEY } from '../lib/constants';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';

const Link = createFactory(LinkComponent);
const Loader = createFactory(LoaderComponent);
const Textarea = createFactory(TextareaComponent);

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
    if (!this.state.house.house) return Loader();

    const nameField = DOM.input({
      ref: HOUSE_NAME_KEY,
      key: HOUSE_NAME_KEY,
      className: HOUSE_NAME_KEY,
      value: this.state.house.house[HOUSE_NAME_KEY] || '',
      onChange: _.partial(this._onChange, HOUSE_NAME_KEY)
    });

    return DOM.div({ className: 'house full-screen' },
      DOM.header(null,
        Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), ' Back'),
        DOM.h1()
      ),
      DOM.form(null, [nameField].concat(this._fields()))
    );
  },

  _fields () {
    if (!this.state.settings.fields.length) return Loader({ key: '__loading' });

    return _.map(this.state.settings.fields, (field) => {
      const key = _.camelCase(field.label);
      return DOM.fieldset({ key: field.id },
        DOM.label(null, field.label),
        Textarea({
          ref: key,
          value: this.state.house.house[key] || field.defaultNotes || '',
          onChange: _.partial(this._onChange, key)
        })
      );
    });
  },

  _onChange (key) {
    houseActions.update(_.extend({}, this.state.house.house, {
      [key]: this.refs[key].getDOMNode().value
    }));
  }
});
