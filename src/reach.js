'use strict';

const { incompletegamma } = require('./igamma');
const { mean, stdDev, stdDevByMean } = require('./stats');
const sqrt = Math.sqrt;
const exp = Math.exp;
const sqr = x => x * x;

const calcDistanceInMeters = (a, b, { metersPerLat, metersPerLon }) =>
sqrt(
  sqr((a.lat - b.lat) * metersPerLat) +
  sqr((a.lon - b.lon) * metersPerLon)
);

const calcDistanceToOther = (a, b, city) =>
a === b ? Infinity : calcDistanceInMeters(a, b, city);

function calcRace(coords, metersPerDegrees) {
  const nearestNeighborths =
    coords.map(p1 => Math.min(...coords.map(p2 => calcDistanceToOther(p1, p2, metersPerDegrees))));
  const avg = mean(nearestNeighborths);
  const std = stdDevByMean(nearestNeighborths, avg);
  return mean(nearestNeighborths.filter(dist => dist >= avg - std && dist <= avg + std));
}

function generateReachChart(
  { grp, race, square, flatness },
  { race: cityRace, square: citySquare },
  options
) {
  // FIXME: next line should be in arguments, but v8 will support it in next version
  const { days = 30, frequency = 100 } = options || {};
  const RACE_C = 0.07;
  const LAMBDA_C = 0.008;
  const DAY_C = 40.0;
  const ALPHA_C = 4.0;
  const reachStart = (1 - exp(-RACE_C * sqrt(sqrt(cityRace / race)))) * grp;
  const tmp = sqrt(grp * (square / citySquare)) / 100;
  const reachEnd = reachStart + (100 - reachStart) * (1 - exp(-days * tmp));

  const lambda = sqr(LAMBDA_C * reachEnd);
  const kDay = DAY_C / reachEnd;
  const kK = ALPHA_C * flatness * (race / cityRace);
  const ampl = reachEnd;

  const reach = [];
  for (let j = 1; j <= days; j++) {
    const x = 1.0 + j * kDay;
    const row = reach[j - 1] = [];
    for (let i = 1; i <= frequency; i++) {
      const alpha = 1.0 + i * kK;
      row[i - 1] = ampl * incompletegamma(alpha, lambda * x);
    }
  }
  return reach;
}

function calcRegionGRP(boards) {
  return boards.reduce((total, { grp, visibility }) => total + grp * visibility, 0);
}

function calcSquareAndFlatness(coords, { metersPerLat, metersPerLon }) {
  const width = metersPerLat * stdDev(coords.map(p => p.lat));
  const height = metersPerLon * stdDev(coords.map(p => p.lon));
  const square = Math.PI * width * height;
  const flatness = width < height ? width / height : height / width;
  return { square, flatness };
}

module.exports = {
  calcDistanceInMeters,
  calcRegionGRP,
  calcRace,
  calcSquareAndFlatness,
  generateReachChart,
};

