const comfortQuotes = [
  'Shesh hoye geche bole mone hoy, kintu shanto shash nite nite notun shuruo hoy.',
  'Aajkaal mon bhari lagle o, ekta chhoto padakkhep-i enough.',
  'Bondho hoye jawa ekhono shesh noy; eta proshikkhon, porer bhalo din-er jonno.',
  'Dukkho ke shobdo dao, tarpor sheta dhire dhire halka hoye jay.',
  'Tumi bhenge gecho na — tumi ekhono shomoy-er sathe heal korcho.',
];

function getRandomComfortQuote() {
  return comfortQuotes[Math.floor(Math.random() * comfortQuotes.length)];
}

module.exports = { comfortQuotes, getRandomComfortQuote };
