import _ from 'lodash';
import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import houseActions from './house-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import FieldsStore from '../fields/fields-store';
import fieldsActions from '../fields/fields-actions';
import { HOUSE_NAME_KEY } from '../lib/constants';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';
import { numberFromString, currencyFromNumber } from '../lib/util';

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
        [nameField]
          .concat(this._info())
          .concat(this._fields())
          .concat(DOM.button({
            key: '__remove',
            className: 'remove',
            onClick: this._remove }, 'Remove house'))
      )
    );
  },

  _info () {
    return DOM.div({ className: 'info', key: '__info' },
      DOM.p(null,
        'Down payment: ',
        DOM.span({ className: 'value' }, currencyFromNumber(this._downPayment()))
      ),
      DOM.p(null,
        'Closing cost: ',
        DOM.span({ className: 'value' }, this._closingCost())
      ),
      DOM.p(null,
        'Monthly cost (15 yr): ',
        DOM.span({ className: 'value' }, this._monthlyCost(15))
      ),
      DOM.p(null,
        'Monthly cost (30 yr): ',
        DOM.span({ className: 'value' }, this._monthlyCost(30))
      )
    );
  },

  _closingCost () {
    const houseCost = this._houseCost();
    return `${currencyFromNumber(houseCost * 0.02)} - ${currencyFromNumber(houseCost * 0.05)}`;
  },

  _monthlyCost (years) {
    const houseCost = this._houseCost();
    const downPayment = this._downPayment();
    const interestRate = numberFromString(this.state.settings.interestRate);
    const insuranceRate = numberFromString(this.state.settings.insuranceRate);

    const mortgage = this._mortgage(houseCost - downPayment, interestRate, years);
    const monthlyTaxes = this._taxes() / 12;
    const monthlyInsurance = houseCost * insuranceRate / 12;
    return currencyFromNumber(mortgage + monthlyTaxes + monthlyInsurance);
  },

  _mortgage (initialCost, interestRate, years) {
    const numPayments = years * 12;
    const monthlyRate = interestRate / 12;
    return (monthlyRate * initialCost * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  },

  _downPayment () {
    return numberFromString(this.state.settings.downPayment);
  },

  _houseCost () {
    const costKey = this.state.settings.costField;
    if (!costKey) return 0;

    return numberFromString(this.state.house.house[costKey]);
  },

  _taxes () {
    const taxesKey = this.state.settings.taxesField;
    if (!taxesKey) return 0;

    return numberFromString(this.state.house.house[taxesKey]);
  },

  _fields () {
    if (!this.state.fields.fields.length) return Loader({ key: '__loading' });

    return _.map(this.state.fields.fields, (field) => {
      return DOM.fieldset({ key: field.id },
        DOM.label(null, field.label),
        Textarea({
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
