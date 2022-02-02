import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import { numberFromString, currencyFromNumber, decimalFromPercent } from '../lib/util'
import { settingsStore } from '../settings/settings-store'

const mortgageLengths = () => {
  const lengthsString = settingsStore.get('mortgageLengths') || '30'

  return _.map(lengthsString.split(/[^0-9]+/), (length) => {
    return parseInt(length, 10)
  })
}

const closingCost = (house) => {
  return houseField(house, 'cost') * decimalFor('closingRate')
}

const monthlyCost = (house, years) => {
  const houseCost = houseField(house, 'cost')
  const downPaymentCost = downPayment(house)
  const loanCost = houseCost - downPaymentCost
  const interestRate = decimalFor('interestRate')
  const insuranceRate = decimalFor('insuranceRate')

  const mortgageCost = mortgage(loanCost, interestRate, years)
  const monthlyTaxes = houseField(house, 'taxes') / 12
  const monthlyInsurance = houseCost * insuranceRate / 12
  const pmiCost = requiresPMI(house) ? pmi(loanCost) : 0
  const miscMonthlyCosts = houseField(house, 'miscMonthlyCosts')

  return currencyFromNumber(mortgageCost + monthlyTaxes + monthlyInsurance + pmiCost + miscMonthlyCosts)
}

const mortgage = (initialCost, interestRate, years) => {
  const numPayments = years * 12
  const monthlyRate = interestRate / 12

  return (monthlyRate * initialCost * Math.pow(1 + monthlyRate, numPayments)) /
         (Math.pow(1 + monthlyRate, numPayments) - 1)
}

const pmi = (loanCost) => {
  return loanCost * decimalFor('pmiRate') / 12
}

const downPayment = (house) => {
  const houseCost = houseField(house, 'cost')
  let downPaymentCost = numberFromString(settingsStore.get('downPayment'))
  const maxUpfrontCost = numberFromString(settingsStore.get('maxUpfrontCost'))

  if (downPaymentCost <= 100) {
    downPaymentCost = decimalFromPercent(downPaymentCost) * houseCost
  }

  const totalUpfrontCost = downPaymentCost + closingCost(house) + houseField(house, 'miscUpfrontCosts')

  if (totalUpfrontCost > maxUpfrontCost) {
    downPaymentCost = downPaymentCost - (totalUpfrontCost - maxUpfrontCost)
  }

  return downPaymentCost
}

const downPaymentPercent = (house) => {
  return ((downPayment(house) / houseField(house, 'cost')) * 100).toFixed(2)
}

const upfrontCost = (house) => {
  return downPayment(house) + closingCost(house) + houseField(house, 'miscUpfrontCosts')
}

const houseField = (house, field) => {
  const key = settingsStore.get(`${field}Field`)

  if (!key) return 0

  return numberFromString(house.get(key))
}

const decimalFor = (field) => {
  return decimalFromPercent(numberFromString(settingsStore.get(field)))
}

const requiresPMI = (house) => {
  return downPaymentPercent(house) < 20
}

export const HouseInfo = observer(({ house }) => (
  <div className='house-info'>
    <p>
      Down payment:{' '}
      <span className='value'>
        {currencyFromNumber(downPayment(house))}
      </span>
      {' '}({downPaymentPercent(house)}%)
    </p>
    <p>
      Closing cost:{' '}
      <span className='value'>
        {currencyFromNumber(closingCost(house))}
      </span>
    </p>
    <p>
      Upfront cost:{' '}
      <span className='value'>
        {currencyFromNumber(upfrontCost(house))}
      </span>
    </p>
    <p>
      Monthly cost{requiresPMI(house) ? ' (includes PMI)' : ''}
    </p>
    <div>
      {_.map(mortgageLengths(), (length) => (
        <p key={`mortlen-${length}`}>
          {length} yr: <span className='value'>
            {monthlyCost(house, length)}
          </span>
        </p>
      ))}
    </div>
  </div>
))
