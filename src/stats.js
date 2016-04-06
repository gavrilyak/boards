'use strict';

const sqrt = Math.sqrt;
const sqr = x => x * x;

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

const variancePopByMean = (arr, m) => mean(arr.map(x => sqr(x - m)));

function varianceByMean(arr, m) {
  const n = arr.length;
  let v1 = 0;
  let v2 = 0;
  for (let i = 0; i < n; i++) {
    v1 += sqr(arr[i] - m);
    v2 += arr[i] - m;
  }
  v2 = sqr(v2) / n;
  const res = (v1 - v2) / (n - 1);
  return res < 0 ? 0 : res;
}

const stdDevByMean = (arr, m) => sqrt(varianceByMean(arr, m));
const variance = arr => varianceByMean(arr, mean(arr));
const stdDev = arr => sqrt(variance(arr));

module.exports = {
  sum,
  mean,
  stdDevByMean,
  variancePopByMean,
  stdDev,
};
