import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import cs from 'classnames'
import _ from 'lodash'
import { observer, useLocalStore } from 'mobx-react'
import React from 'react'

import { currencyFromNumber } from '../lib/util'
import { getClosingCost, getDownPayment, getDownPaymentPercent, getHouseCost, getHypotheticals, getLoanAmount, getLoanLimitOverage, getMonthlyCost, getMortgageLengths, getUpfrontCost, requiresPMI } from './house-info-util'
import { settingsStore } from '../settings/settings-store'

import { Icon } from '../lib/icon'

const Info = ({ prefix, value, valueClass, suffix }) => (
  <p>
    {prefix}
    <span className={cs('value', valueClass)}>
      {value}
    </span>
    {suffix}
  </p>
)

const HouseCost = observer(({ amount }) => (
  <Info
    prefix='House cost:'
    value={currencyFromNumber(amount)}
  />
))

const ClosingCost = observer(({ amount }) => (
  <Info
    prefix='Closing cost:'
    value={currencyFromNumber(amount)}
  />
))

const DownPayment = observer(({ amount, percent }) => (
  <Info
    prefix='Down payment:'
    value={currencyFromNumber(amount)}
    suffix={`(${percent}%)`}
  />
))

const UpfrontCost = observer(({ amount }) => (
  <Info
    prefix='Upfront cost:'
    value={currencyFromNumber(amount)}
  />
))

const LoanAmount = observer(({ amount, overage }) => (
  <Info
    prefix='Loan amount:'
    value={currencyFromNumber(amount)}
    valueClass={{ 'is-over-limit': overage > 0 }}
    suffix={overage > 0 && `(Over by ${currencyFromNumber(overage)})`}
  />
))

const MonthlyCosts = observer(({ house, downPayment }) => (
  <>
    <p>
      Monthly cost{requiresPMI(house, downPayment) ? ' (includes PMI)' : ''}
    </p>
    <div className='monthly-costs'>
      {_.map(getMortgageLengths(), (length) => (
        <Info
          key={length}
          prefix={`${length} yr:`}
          value={getMonthlyCost(house, length, downPayment)}
        />
      ))}
    </div>
  </>
))

const HypotheticalsContent = observer(({ house, hypotheticals }) => {
  return _.map(hypotheticals, (hypothetical) => (
    <div key={hypothetical.percent} className='hypothetical'>
      <DownPayment amount={hypothetical.downPayment} percent={hypothetical.percent} />
      <UpfrontCost amount={hypothetical.upfrontCost} />
      <LoanAmount amount={hypothetical.loanAmount} overage={hypothetical.loanLimitOverage} />
      <MonthlyCosts house={house} downPayment={hypothetical.downPayment} />
    </div>
  ))
})

const Hypotheticals = observer(({ house }) => {
  const hypotheticals = getHypotheticals(house)
  const state = useLocalStore(() => ({
    isShowingHypotheticals: false,
    toggleShowingHypotheticals () {
      this.isShowingHypotheticals = !this.isShowingHypotheticals
    },
  }))

  if (!settingsStore.get('hypotheticals') || !hypotheticals.length) return null

  return (
    <>
      <div className='toggle-hypotheticals' onClick={state.toggleShowingHypotheticals}>
        <Icon icon={state.isShowingHypotheticals ? faCaretDown : faCaretRight}>
          {state.isShowingHypotheticals ? 'Hide' : 'Show'} Hypotheticals
        </Icon>
      </div>
      {state.isShowingHypotheticals &&
        <HypotheticalsContent house={house} hypotheticals={hypotheticals} />}
    </>
  )
})

export const HouseInfo = observer(({ house }) => (
  <div className='house-info'>
    <HouseCost amount={getHouseCost(house)} />
    <ClosingCost amount={getClosingCost(house)} />
    <div className='break' />
    <DownPayment amount={getDownPayment(house)} percent={getDownPaymentPercent(house)} />
    <UpfrontCost amount={getUpfrontCost(house)} />
    <LoanAmount amount={getLoanAmount(house)} overage={getLoanLimitOverage(house)} />
    <MonthlyCosts house={house} />
    <Hypotheticals house={house} />
  </div>
))
