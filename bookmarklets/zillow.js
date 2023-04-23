(function () {
  if (!location.href.includes('zillow.com/homedetails')) return

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
  const getByLabel = (label, el = 'span') => {
    return contains(el, label).innerText.replace(`${label}: `, '').trim()
  }
  const guard = (exec) => {
    try {
      return exec()
    } catch (err) {}
  }

  const beds = guard(() => getByLabel('Bedrooms')) || 0
  const fullBaths = guard(() => Number(getByLabel('Full bathrooms'))) || 0
  const halfBaths = guard(() => Number(getByLabel('1/2 bathrooms'))) || 0
  const baths = fullBaths + (halfBaths * 0.1)
  const garageSpaces = guard(() => Number(getByLabel('Garage spaces'))) || 0
  const getTaxes = () => {
    const taxHeading = contains('h5', 'Public tax history')
    const taxAmountEl = $('table tbody tr:first-child td:nth-child(2) span', taxHeading.parentNode)
    const change = guard(() => taxAmountEl.querySelector('span').innerText)

    // remove "+2.9%", etc
    return taxAmountEl.innerText.replace(change, '').trim()
  }
  const getZestimate = () => {
    const label = contains('button', 'Zestimate')

    return label.parentNode.querySelector('span').innerText.replace('$', '')
  }

  const details = {
    address: guard(() => $('.summary-container h1').innerText),
    askingPrice: guard(() => $('[data-testid="price"]').innerText.replace('$', '')),
    zillowLink: guard(() => location.href.replace(location.search, '')),
    cooling: guard(() => getByLabel('Cooling features')),
    heating: guard(() => getByLabel('Heating features')),
    houseSize: guard(() => getByLabel('Total interior livable area').replace('sqft', 'sq ft')),
    lotSize: guard(() => getByLabel('Lot size')),
    parking: `${garageSpaces} space${garageSpaces === 1 ? '' : 's'}`,
    rooms: `${beds} bed, ${baths} bath`,
    sewer: guard(() => getByLabel('Sewer information')),
    taxes: guard(() => getTaxes()),
    waterSource: guard(() => getByLabel('Water information')),
    yearBuilt: guard(() => getByLabel('Year built')),
    zestimate: guard(() => getZestimate()),
  }
  const query = Object.keys(details).map((key) => `${key}=${encodeURIComponent(details[key])}`).join('&')

  location.href = `https://doogie.crbapps.com/add?${query}`
  // location.href = `http://localhost:8000/add?${query}`
}())
