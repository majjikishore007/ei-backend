var urlify = require('urlify').create({
    addEToUmlauts:true,
    szToSs:true,
    spaces:"-",
    nonPrintable:"-",
    trim:true
  });
module.exports = urlify;