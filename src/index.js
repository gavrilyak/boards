'use strict';
const {
  calcRegionGRP,
  calcSquareAndFlatness,
  calcRace,
  generateReachChart,
} = require('./reach');

function calcReach(boards, city, options) {
  const grp = calcRegionGRP(boards);
  const race = calcRace(boards, city);
  const { square, flatness } = calcSquareAndFlatness(boards, city);
  return generateReachChart({ grp, race, square, flatness }, city, options);
}

module.exports = calcReach;

