import _ from 'lodash';
import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import houseActions from './house-actions';
import FieldsStore from '../fields/fields-store';
import fieldsActions from '../fields/fields-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import { HOUSE_NAME_KEY, DEFAULT_FIELD_TYPE } from '../lib/constants';
import HouseInfoComponent from './house-info';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';

const Link = createFactory(LinkComponent);
const HouseInfo = createFactory(HouseInfoComponent);
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
      fields: FieldsStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    houseActions.listen(this._getId());
    fieldsActions.listen();
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
    fieldsActions.stopListening();
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
        Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), 'Back'),
        DOM.h1()
      ),
      DOM.form({ onSubmit: this._onSubmit },
        nameField,
        HouseInfo({ house: this.state.house.house, key: '__info'  }),
        this._zillowLink(),
        this._fields(),
        DOM.button({
            key: '__remove',
            className: 'remove',
            onClick: this._remove
          }, 'Remove house'
        )
      )
    );
  },

  _zillowLink () {
    const link = this.state.house.house[this.state.settings.zillowLinkField];
    if (!link) return null;

    return DOM.a({ href: link, target: '_blank', className: 'zillow-link' },
      'View on Zillow', DOM.i({ className: 'fa fa-external-link'})
    );
  },

  _fields () {
    if (!this.state.fields.fields.length) return Loader({ key: '__loading' });

    return _.map(this.state.fields.fields, (field) => {
      const textField = field.type === 'textarea' ? Textarea : DOM[DEFAULT_FIELD_TYPE];

      return DOM.fieldset({ key: field.id },
        DOM.label(null, field.label),
        textField({
          ref: field.id,
          value: this.state.house.house[field.id] || field.defaultNotes || '',
          onChange: _.partial(this._onChange, field.id)
        })
      );
    });
  },

  _onChange (key) {
    houseActions.update(_.extend({}, this.state.house.house, {
      [key]: this.refs[key].getDOMNode().value
    }));
  },

  _remove () {
    if (confirm('Remove this house?')) {
      houseActions.remove(this.state.house.house.id);
      this.context.router.transitionTo('menu');
    }
  },

  _onSubmit (e) {
    e.preventDefault();
  }
});
