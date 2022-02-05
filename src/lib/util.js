export const numberFromString = (numString = '0') => {
  return Number(numString.replace(/[^0-9\.]/g, ''))
}

export const currencyFromNumber = (num = 0, round = false) => {
  const centDigits = 2
  const sign = num < 0 ? '-' : ''
  const numString = `${parseInt(num = Math.abs(+num || 0).toFixed(centDigits))}`
  const numDigits = numString.length
  const firstDigits = numDigits > 3 ? numDigits % 3 : 0
  const cents = Math.abs(num - Number(numString)).toFixed(centDigits).slice(2)

  return [
    sign,
    `$${firstDigits ? `${numString.substr(0, firstDigits)},` : ''}`,
    numString.substr(firstDigits).replace(/(\d{3})(?=\d)/g, '$1,'),
    cents === '00' || round ? '' : `.${cents}`,
  ].join('')
}

export const decimalFromPercent = (percent) => {
  return percent / 100
}

export const directionsUrl = (address) => {
  return `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodeURIComponent(address)}`
}

export const mapUrl = (address) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export const isStandalone = () => {
  // means it's saved to the home screen on iOS
  return window.navigator.standalone
}
