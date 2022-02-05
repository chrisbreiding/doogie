import _ from 'lodash'

import { numberFromString, currencyFromNumber, decimalFromPercent } from '../lib/util'
import { settingsStore } from '../settings/settings-store'

export const getMortgageLengths = () => {
  const lengthsString = settingsStore.get('mortgageLengths') || '30'

  return _.map(lengthsString.split(/[^0-9]+/), (length) => {
    return parseInt(length, 10)
  })
}

export const getHouseCost = (house) => houseField(house, 'cost')

export const getClosingCost = (house) => {
  return getHouseCost(house) * decimalFor('closingRate')
}

export const getMonthlyCost = (house, years, downPayment) => {
  const houseCost = getHouseCost(house)
  const downPaymentCost = downPayment || getDownPayment(house)
  const loanCost = houseCost - downPaymentCost
  const interestRate = decimalFor('interestRate')
  const insuranceRate = decimalFor('insuranceRate')

  const mortgageCost = mortgage(loanCost, interestRate, years)
  const monthlyTaxes = houseField(house, 'taxes') / 12
  const monthlyInsurance = houseCost * insuranceRate / 12
  const pmiCost = requiresPMI(house) ? pmi(loanCost) : 0
  const miscMonthlyCosts = houseField(house, 'miscMonthlyCosts')

  return currencyFromNumber(mortgageCost + monthlyTaxes + monthlyInsurance + pmiCost + miscMonthlyCosts, true)
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

export const getDownPayment = (house) => {
  const houseCost = getHouseCost(house)
  let downPaymentCost = numberFromString(settingsStore.get('downPayment'))
  const maxUpfrontCost = numberFromString(settingsStore.get('maxUpfrontCost'))

  if (downPaymentCost <= 100) {
    downPaymentCost = decimalFromPercent(downPaymentCost) * houseCost
  }

  const totalUpfrontCost = downPaymentCost + getClosingCost(house) + houseField(house, 'miscUpfrontCosts')

  if (totalUpfrontCost > maxUpfrontCost) {
    downPaymentCost = downPaymentCost - (totalUpfrontCost - maxUpfrontCost)
  }

  return downPaymentCost
}

export const getDownPaymentPercent = (house, downPayment) => {
  return Number((((downPayment || getDownPayment(house)) / getHouseCost(house)) * 100).toFixed(2))
}

export const getUpfrontCost = (house, downPayment) => {
  return (downPayment || getDownPayment(house)) + getClosingCost(house) + houseField(house, 'miscUpfrontCosts')
}

export const getLoanAmount = (house, downPayment) => {
  return getHouseCost(house) - (downPayment || getDownPayment(house))
}

export const getLoanLimitOverage = (house, downPayment) => {
  return getLoanAmount(house, downPayment) - numberFromString(settingsStore.get('loanLimit'))
}

const houseField = (house, field) => {
  const key = settingsStore.get(`${field}Field`)

  if (!key) return 0

  return numberFromString(house.get(key))
}

const decimalFor = (field) => {
  return decimalFromPercent(numberFromString(settingsStore.get(field)))
}

export const requiresPMI = (house, downPayment) => {
  return getDownPaymentPercent(house, downPayment) < 20
}

export const getHypotheticals = (house) => {
  const lengthsString = settingsStore.get('hypotheticals')

  if (!lengthsString) return []

  const cost = getHouseCost(house)

  return _.compact(_.map(lengthsString.split(/[^0-9]+/), (percentString) => {
    const percent = parseInt(percentString, 10)

    if (percent <= getDownPaymentPercent(house)) return

    const downPayment = cost * decimalFromPercent(percent)
    const loanAmount = getLoanAmount(house, downPayment)
    const upfrontCost = getUpfrontCost(house, downPayment)
    const loanLimitOverage = getLoanLimitOverage(house, downPayment)

    return {
      percent,
      downPayment,
      upfrontCost,
      loanAmount,
      loanLimitOverage,
    }
  }))
}
