import { createClass, PropTypes, DOM } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import SettingsStore from '../settings/settings-store';
import { listen, stopListening } from '../settings/settings-actions';
import { numberFromString, currencyFromNumber, decimalFromPercent } from '../lib/util';

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
      DOM.p(null, 'Monthly cost', this._requiresPMI() ? ' (includes PMI)' : null),
      DOM.div(null,
        DOM.p(null,
          '15 yr: ', DOM.span({ className: 'value' }, this._monthlyCost(15))
        ),
        DOM.p(null,
          '30 yr: ', DOM.span({ className: 'value' }, this._monthlyCost(30))
        )
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
    const loanCost = houseCost - downPayment;
    const interestRate = decimalFromPercent(numberFromString(this.state.interestRate));
    const insuranceRate = decimalFromPercent(numberFromString(this.state.insuranceRate));

    const mortgage = this._mortgage(loanCost, interestRate, years);
    const monthlyTaxes = this._houseField('taxes') / 12;
    const monthlyInsurance = houseCost * insuranceRate / 12;
    const pmi = this._requiresPMI() ? this._pmi(loanCost) : 0;
    return currencyFromNumber(mortgage + monthlyTaxes + monthlyInsurance + pmi);
  },

  _mortgage (initialCost, interestRate, years) {
    const numPayments = years * 12;
    const monthlyRate = interestRate / 12;
    return (monthlyRate * initialCost * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  },

  _pmi (loanCost) {
    return loanCost * decimalFromPercent(numberFromString(this.state.pmiRate)) / 12;
  },

  _downPayment () {
    return numberFromString(this.state.downPayment);
  },

  _houseField (field) {
    const key = this.state[`${field}Field`];
    if (!key) return 0;

    return numberFromString(this.props.house[key]);
  },

  _requiresPMI () {
    return (this._downPayment() / this._houseField('cost')) < 0.2;
  }
});
