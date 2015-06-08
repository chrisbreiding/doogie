import { createClass, PropTypes, DOM } from 'react';
import { numberFromString, currencyFromNumber, decimalFromPercent } from '../lib/util';

export default createClass({
  render () {
    return DOM.div({ className: 'info' },
      DOM.p(null,
        'Down payment: ',
        DOM.span({ className: 'value' }, currencyFromNumber(this._downPayment())),
        ` (${this._downPaymentPercent()}%)`
      ),
      DOM.p(null,
        'Closing cost: ',
        DOM.span({ className: 'value' }, currencyFromNumber(this._closingCost()))
      ),
      DOM.p(null,
        'Upfront cost: ',
        DOM.span({ className: 'value' }, currencyFromNumber(this._upfrontCost()))
      ),
      DOM.p(null, 'Monthly cost', this._requiresPMI() ? ' (includes PMI)' : null),
      DOM.div(null,
        _.map(this._mortgageLengths(), (length) => {
          return DOM.p({ key: `mortlen-${length}` },
            `${length} yr: `, DOM.span({ className: 'value' }, this._monthlyCost(length))
          );
        })
      )
    );
  },

  _mortgageLengths () {
    const lengthsString = this.props.settings.mortgageLengths || '30';
    return _.map(lengthsString.split(/[^0-9]+/), (length) => {
      return parseInt(length, 10);
    });
  },

  _closingCost () {
    return this._houseField('cost') * this._decimalFor('closingRate');
  },

  _monthlyCost (years) {
    const houseCost = this._houseField('cost');
    const downPayment = this._downPayment();
    const loanCost = houseCost - downPayment;
    const interestRate = this._decimalFor('interestRate');
    const insuranceRate = this._decimalFor('insuranceRate');

    const mortgage = this._mortgage(loanCost, interestRate, years);
    const monthlyTaxes = this._houseField('taxes') / 12;
    const monthlyInsurance = houseCost * insuranceRate / 12;
    const pmi = this._requiresPMI() ? this._pmi(loanCost) : 0;
    const miscMonthlyCosts = this._houseField('miscMonthlyCosts');
    return currencyFromNumber(mortgage + monthlyTaxes + monthlyInsurance + pmi + miscMonthlyCosts);
  },

  _mortgage (initialCost, interestRate, years) {
    const numPayments = years * 12;
    const monthlyRate = interestRate / 12;
    return (monthlyRate * initialCost * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  },

  _pmi (loanCost) {
    return loanCost * this._decimalFor('pmiRate') / 12;
  },

  _downPayment () {
    const houseCost = this._houseField('cost');
    let downPayment = numberFromString(this.props.settings.downPayment);
    const maxUpfrontCost = numberFromString(this.props.settings.maxUpfrontCost);
    if (downPayment <= 100) {
      downPayment = decimalFromPercent(downPayment) * houseCost;
    }
    const totalUpfrontCost = downPayment + this._closingCost() + this._houseField('miscUpfrontCosts');
    if (totalUpfrontCost > maxUpfrontCost) {
      downPayment = downPayment - (totalUpfrontCost - maxUpfrontCost);
    }

    return downPayment;
  },

  _upfrontCost () {
    return this._downPayment() + this._closingCost() + this._houseField('miscUpfrontCosts');
  },

  _downPaymentPercent () {
    return ((this._downPayment() / this._houseField('cost')) * 100).toFixed(2);
  },

  _houseField (field) {
    const key = this.props.settings[`${field}Field`];
    if (!key) return 0;

    return numberFromString(this.props.house[key]);
  },

  _decimalFor (field) {
    return decimalFromPercent(numberFromString(this.props.settings[field]));
  },

  _requiresPMI () {
    return this._downPaymentPercent() < 20;
  }
});
