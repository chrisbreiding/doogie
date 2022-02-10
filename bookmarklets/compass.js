(function () {
  if (!location.href.includes('compass.com/listing')) return

  const $ = (selector, from = document) => {
    const el = from.querySelector(selector)

    if (!el) {
      console.log('No element found for selector:', selector)
    }

    return el
  }
  const contains = (el, text) => {
    const result = document.evaluate(`//${el}[contains(text(),'${text}')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    if (!result) {
      console.log('No element found with text:', text)
    }

    return result
  }
  const getInfo = (text) => {
    return $('span', contains('div', text).parentElement).innerText.replace('$', '')
  }
  const guard = (exec) => {
    try {
      return exec()
    } catch (err) {}
  }

  const beds = guard(() => $('[data-tn=listing-page-summary-beds] .textIntent-title2').innerText) || 0
  const fullBaths = guard(() => Number($('[data-tn=listing-page-summary-baths] .textIntent-title2').innerText)) || 0
  const halfBaths = guard(() => Number($('[data-tn="listing-page-summary-1/2bath"] .textIntent-title2').innerText) / 2) || 0
  const baths = fullBaths + halfBaths
  const garage = guard(() => getInfo('Garage')) === 'Yes'
  const garageType = garage && guard(() => getInfo('Type Of Parking'))
  const garageSpaces = garage && guard(() => getInfo('Total Garage Spaces'))

  const details = {
    address: guard(() => $('[data-tn=listing-page-address]').parentElement.innerText.replace(/\n+/, ', ')),
    compassLink: guard(() => location.href.replace(location.search, '')),
    cooling: guard(() => `${getInfo('Cooling Type')}, ${getInfo('Cooling Fuel')}`),
    cost: guard(() => $('[data-tn=listing-page-summary-price] .textIntent-title2').innerText.replace('$', '')),
    heating: guard(() => `${getInfo('Heating Type')}, ${getInfo('Heating Fuel')}`),
    houseSize: guard(() => $('[data-tn=listing-page-summary-sq-ft] .textIntent-title2').innerText.replace('Sq. Ft.', 'sq ft')),
    lotSize: guard(() => `${getInfo('Lot SQFT')} sq ft / ${getInfo('Lot Size Acres')} acre`),
    parking: garage ? `${garageSpaces} spaces, ${garageType}` : 'No garage',
    rooms: `${beds} bed, ${baths} bath`,
    sewer: guard(() => getInfo('Sewer Septic')),
    taxes: guard(() => getInfo('Tax Annual Amount')),
    waterSource: guard(() => getInfo('Water Source')),
    yearBuilt: guard(() => $('td', contains('th', 'Year Built').parentElement).innerText),
  }
  const query = Object.keys(details).map((key) => `${key}=${encodeURIComponent(details[key])}`).join('&')

  location.href = `https://doogie.crbapps.com/add?${query}`
}())
