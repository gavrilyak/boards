'use strict';

const { incompletegamma } = require('./igamma');
const { mean, stdDev, stdDevByMean } = require('./stats');
const sqrt = Math.sqrt;
const exp = Math.exp;
const sqr = x => x * x;
/* eslint-disable no-console */

const distance = (a, b, { LX, LY }) => sqrt(sqr((a.lat - b.lat) * LX) + sqr((a.lon - b.lon) * LY));
function calcAverageDistance(coords, city) {
  const distances =
    coords.map(p1 => Math.min(...coords.map(p2 => p1 == p2 ? Infinity : distance(p1, p2, city))));
  const avg = mean(distances);
  const std = stdDevByMean(distances, avg);
  const upperLimit = avg + std;
  const lowerLimit = avg - std;
  const distancesWithiLimits = distances.filter(dist => dist >= lowerLimit && dist <= upperLimit);
  return mean(distancesWithiLimits);
}

function calculateReach(boards, city, options) {
  const opts = options || {};
  const { days = 30, frequency = 100 } = opts;
  const regionGRP = boards.reduce((total, { grp, visibility }) => total + grp * visibility, 0);
  const coords = boards.map(({ x, y }) => ({ lat: x, lon: y }));
  const avgDistance = calcAverageDistance(coords, city);
  const width = city.LX * stdDev(coords.map(p => p.lat));
  const height = city.LY * stdDev(coords.map(p => p.lon));
  const square = Math.PI * width * height / 1000000.0; // ???
  const flatness = width < height ? width / height : height / width;
  // console.log(regionGRP, avgDistance, square, flatness);
  const RACE_C = 0.07;
  const LAMBDA_C = 0.008;
  const DAY_C = 40.0;
  const ALPHA_C = 4.0;
  const reachStart = (1 - exp(-RACE_C * sqrt(sqrt(city.race / avgDistance)))) * regionGRP;
  const tmp = sqrt(regionGRP * (square / city.square)) / 100;
  const reachEnd = reachStart + (100 - reachStart) * (1 - exp(-days * tmp));
  // console.log(reachStart, reachEnd);

  const lambda = sqr(LAMBDA_C * reachEnd);
  const kDay = DAY_C / reachEnd;
  const kK = ALPHA_C * flatness * (avgDistance / city.race);
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

module.exports = {
  calculateReach,
};

