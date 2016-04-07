'use strict';
const {
  calcRegionGRP,
  calcSquareAndFlatness,
  calcRace,
  generateReachChart,
} = require('./reach');

function calcReach(boards, city, options) {
  const grp = calcRegionGRP(boards);
  const coords = boards.map(({ lat, lon }) => ({ lat, lon }));
  const race = calcRace(coords, city);
  const { square, flatness } = calcSquareAndFlatness(coords, city);
 // console.log(grp, avgDistance, square, flatness);
  return generateReachChart({ grp, race, square, flatness }, city, options);
}
module.exports = calcReach;

