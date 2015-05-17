export default {
  numberFromString (numString = '0') {
    return Number(numString.replace(/[^0-9\.]/g, ''));
  },

  currencyFromNumber (num = 0) {
    var centDigits = 2,
        sign = num < 0 ? '-' : '',
        numString = parseInt(num = Math.abs(+num || 0).toFixed(centDigits)) + '',
        firstDigits = (firstDigits = numString.length) > 3 ? firstDigits % 3 : 0,
        cents = Math.abs(num - numString).toFixed(centDigits).slice(2);
   return sign +
          '$' +
          (firstDigits ? numString.substr(0, firstDigits) + ',' : '') +
          numString.substr(firstDigits).replace(/(\d{3})(?=\d)/g, '$1,') +
          (cents !== '00' ? '.' + cents : '');
  },

  decimalFromPercent (percent) {
    return percent / 100;
  },

  directionsUrl (address) {
    return `comgooglemaps://?daddr=${address}&directionsmode=driving`;
  }
};
