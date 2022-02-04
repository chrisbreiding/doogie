(function () {
  if (!location.href.includes('compass.com/listing')) return

  const $ = document.querySelector.bind(document)
  const contains = (el, text) => {
    return document.evaluate(`//${el}[contains(text(),'${text}')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  }
  const getInfo = (text) => {
    return contains('div', text).parentElement.querySelector('span').innerText.replace('$', '')
  }

  const beds = $('[data-tn=listing-page-summary-beds] .textIntent-title2').innerText
  const fullBaths = Number($('[data-tn=listing-page-summary-baths] .textIntent-title2').innerText)
  const halfBaths = Number($('[data-tn="listing-page-summary-1/2bath"] .textIntent-title2').innerText) / 2
  const baths = fullBaths + halfBaths

  const details = {
    address: $('[data-tn=listing-page-address]').parentElement.innerText.replace(/\n+/, ', '),
    cost: $('[data-tn=listing-page-summary-price] .textIntent-title2').innerText.replace('$', ''),
    taxes: getInfo('Tax Annual Amount'),
    rooms: `${beds} bed, ${baths} bath`,
    houseSize: $('[data-tn=listing-page-summary-sq-ft] .textIntent-title2').innerText.replace('Sq. Ft.', 'sq ft'),
    lotSize: `${getInfo('Lot SQFT')} sq ft / ${getInfo('Lot Size Acres')} acre`,
    cooling: `${getInfo('Cooling Type')}, ${getInfo('Cooling Fuel')}`,
    heating: `${getInfo('Heating Type')}, ${getInfo('Heating Fuel')}`,
    sewer: getInfo('Sewer Septic'),
    waterSource: getInfo('Water Source'),
    yearBuilt: contains('th', 'Year Built').parentElement.querySelector('td').innerText,
    compassLink: location.href.replace(location.search, ''),
  }
  const query = Object.keys(details).map((key) => `${key}=${encodeURIComponent(details[key])}`).join('&')

  location.href = `https://doogie.crbapps.com/add?${query}`
}())
