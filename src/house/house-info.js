import { createClass, PropTypes, DOM } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import SettingsStore from '../settings/settings-store';
import { listen, stopListening } from '../settings/settings-actions';
import { numberFromString, currencyFromNumber } from '../lib/util';

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStore: SettingsStore
  },

  componentDidMount () {
    listen();
  },

  componentWillUnmount () {
    stopListening();
  },

  render () {
    return DOM.div({ className: 'info' },
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
    const houseCost = this._houseField('cost');
    return `${currencyFromNumber(houseCost * 0.02)} - ${currencyFromNumber(houseCost * 0.05)}`;
  },

  _monthlyCost (years) {
    const houseCost = this._houseField('cost');
    const downPayment = this._downPayment();
    const interestRate = numberFromString(this.state.interestRate);
    const insuranceRate = numberFromString(this.state.insuranceRate);

    const mortgage = this._mortgage(houseCost - downPayment, interestRate, years);
    const monthlyTaxes = this._houseField('taxes') / 12;
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
    return numberFromString(this.state.downPayment);
  },

  _houseField (field) {
    const key = this.state[`${field}Field`];
    if (!key) return 0;

    return numberFromString(this.props.house[key]);
  }
});
