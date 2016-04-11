'use strict';
const { log, exp, abs, floor, PI, sin } = Math;

function lngamma(x) {
  const logpi = 1.14472988584940017414;
  const ls2pi = 0.91893853320467274178;
  let result;
  let a;
  let b;
  let c;
  let p;
  let q;
  let u;
  let z;

  if (x < -34.0) {
    q = -x;
    const w = lngamma(q);
    p = floor(q);

    z = q - p;
    if (z > 0.5) {
      p = p + 1;
      z = p - q;
    }

    z = q * sin(PI * z);
    result = logpi - log(z) - w;
    return result;
  }

  if (x < 13) {
    z = 1;
    p = 0;
    u = x;
    while (u >= 3) {
      p = p - 1;
      u = x + p;
      z = z * u;
    }

    while (u < 2) {
      z = z / u;
      p = p + 1;
      u = x + p;
    }

    if (u == 2) {
      result = log(z);
      return result;
    }

    p = p - 2;
    x = x + p; // eslint-disable-line no-param-reassign
    b = -1378.25152569120859100;
    b = -38801.6315134637840924 + x * b;
    b = -331612.992738871184744 + x * b;
    b = -1162370.97492762307383 + x * b;
    b = -1721737.00820839662146 + x * b;
    b = -853555.664245765465627 + x * b;
    c = 1;
    c = -351.815701436523470549 + x * c;
    c = -17064.2106651881159223 + x * c;
    c = -220528.590553854454839 + x * c;
    c = -1139334.44367982507207 + x * c;
    c = -2532523.07177582951285 + x * c;
    c = -2018891.41433532773231 + x * c;
    p = x * b / c;
    result = log(z) + p;
    return result;
  }

  q = (x - 0.5) * log(x) - x + ls2pi;
  if (x > 100000000) {
    result = q;
    return result;
  }

  p = 1 / (x * x);
  if (x >= 1000.0) {
    q = q + ((7.9365079365079365079365 * 0.0001 * p -
                2.7777777777777777777778 * 0.001) * p + 0.0833333333333333333333) / x;
  } else {
    a = 8.11614167470508450300 * 0.0001;
    a = -5.95061904284301438324 * 0.0001 + p * a;
    a = 7.93650340457716943945 * 0.0001 + p * a;
    a = -2.77777777730099687205 * 0.001 + p * a;
    a = 8.33333333333331927722 * 0.01 + p * a;
    q = q + a / x;
  }

  result = q;
  return result;
}

function incompletegamma(a, x) {
  const igammaepsilon = 0.000000000000001;
  let result;
  let ans;
  let ax;
  let c;
  let r;

  if (x <= 0 || a <= 0) {
    result = 0;
    return result;
  }

  if (x > 1 && x > a) {
    result = 1 - incompletegammac(a, x); // eslint-disable-line no-use-before-define
    return result;
  }

  ax = a * log(x) - x - lngamma(a);
  if (ax < -709.78271289338399) {
    result = 0;
    return result;
  }

  ax = exp(ax);
  r = a;
  c = 1;
  ans = 1;
  do {
    r = r + 1;
    c = c * x / r;
    ans = ans + c;
  }
  while (c / ans > igammaepsilon);
  result = ans * ax / a;
  return result;
}

function incompletegammac(a, x) {
  const igammaepsilon = 0.000000000000001;
  const igammabignumber = 4503599627370496.0;
  const igammabignumberinv = 2.22044604925031308085 * 0.0000000000000001;
  let result;
  let ans;
  let ax;
  let c;
  let t;
  let y;
  let z;
  let pkm1;
  let pkm2;
  let qkm1;
  let qkm2;

  if (x <= 0 || a <= 0) {
    result = 1;
    return result;
  }

  if (x < 1 || x < a) {
    result = 1 - incompletegamma(a, x);
    return result;
  }

  ax = a * log(x) - x - lngamma(a);
  if (ax < -709.78271289338399) {
    result = 0;
    return result;
  }

  ax = exp(ax);
  y = 1 - a;
  z = x + y + 1;
  c = 0;
  pkm2 = 1;
  qkm2 = x;
  pkm1 = x + 1;
  qkm1 = z * x;
  ans = pkm1 / qkm1;
  do {
    c = c + 1;
    y = y + 1;
    z = z + 2;
    const yc = y * c;
    const pk = pkm1 * z - pkm2 * yc;
    const qk = qkm1 * z - qkm2 * yc;
    if (qk != 0) {
      const r = pk / qk;
      t = abs((ans - r) / r);
      ans = r;
    } else {
      t = 1;
    }

    pkm2 = pkm1;
    pkm1 = pk;
    qkm2 = qkm1;
    qkm1 = qk;
    if (abs(pk) > igammabignumber) {
      pkm2 = pkm2 * igammabignumberinv;
      pkm1 = pkm1 * igammabignumberinv;
      qkm2 = qkm2 * igammabignumberinv;
      qkm1 = qkm1 * igammabignumberinv;
    }
  } while (t > igammaepsilon);
  result = ans * ax;
  return result;
}

module.exports = {
  lngamma,
  incompletegamma,
  incompletegammac,
};
