'use strict';

const { incompletegamma } = require('./igamma');
const { mean, stdDev, stdDevByMean } = require('./stats');
const { sqrt, exp, min, PI } = Math;
const sqr = x => x * x;

const calcDistanceInMeters = (a, b, { metersPerLat, metersPerLon }) =>
sqrt(
  sqr((a.lat - b.lat) * metersPerLat) +
  sqr((a.lon - b.lon) * metersPerLon)
);

const calcDistanceToOther = (a, b, city) =>
a === b ? Infinity : calcDistanceInMeters(a, b, city);

function calcRace(coords, metersPerDegrees) {
  const nearestNeighbors =
    coords.map(p1 => min(...coords.map(p2 => calcDistanceToOther(p1, p2, metersPerDegrees))));
  const avg = mean(nearestNeighbors);
  const std = stdDevByMean(nearestNeighbors, avg);
  return mean(nearestNeighbors.filter(dist => dist >= avg - std && dist <= avg + std));
}

function generateReachChart(
  { grp, race, square, flatness },
  { race: cityRace, square: citySquare },
  options
) {
  // FIXME: next line should be in arguments, but v8 will support it in next version
  const { days = 30, frequency = 100, frequencyStep = 1 } = options || {};
  const RACE_C = 0.07;
  const LAMBDA_C = 0.008;
  const DAY_C = 40.0;
  const ALPHA_C = 4.0;
  const reachStart = (1 - exp(-RACE_C * sqrt(sqrt(cityRace / race)))) * grp;
  const reachEnd = reachStart +
    (100 - reachStart) * (1 - exp(-days * sqrt(grp * (square / citySquare)) / 100));

  const lambda = sqr(LAMBDA_C * reachEnd);
  const kDay = DAY_C / reachEnd;
  const kK = ALPHA_C * flatness * (race / cityRace);
  const ampl = reachEnd;

  const reach = [];
  for (let j = 1; j <= days; j++) {
    const x = 1.0 + j * kDay;
    const row = reach[j - 1] = [];
    for (let freq = 1; freq <= frequency; freq += frequencyStep) {
      row.push(ampl * incompletegamma(1.0 + freq * kK, lambda * x));
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
  const square = PI * width * height; // ellipse square
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

