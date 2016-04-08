(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["calcReach"] = factory();
	else
		root["calcReach"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(1);
	
	var calcRegionGRP = _require.calcRegionGRP;
	var calcSquareAndFlatness = _require.calcSquareAndFlatness;
	var calcRace = _require.calcRace;
	var generateReachChart = _require.generateReachChart;
	
	
	function calcReach(boards, city, options) {
	  var grp = calcRegionGRP(boards);
	  var race = calcRace(boards, city);
	
	  var _calcSquareAndFlatnes = calcSquareAndFlatness(boards, city);
	
	  var square = _calcSquareAndFlatnes.square;
	  var flatness = _calcSquareAndFlatnes.flatness;
	
	  return generateReachChart({ grp: grp, race: race, square: square, flatness: flatness }, city, options);
	}
	module.exports = calcReach;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var _require = __webpack_require__(2);
	
	var incompletegamma = _require.incompletegamma;
	
	var _require2 = __webpack_require__(3);
	
	var mean = _require2.mean;
	var stdDev = _require2.stdDev;
	var stdDevByMean = _require2.stdDevByMean;
	var sqrt = Math.sqrt;
	var exp = Math.exp;
	var min = Math.min;
	var PI = Math.PI;
	
	var sqr = function sqr(x) {
	  return x * x;
	};
	
	var calcDistanceInMeters = function calcDistanceInMeters(a, b, _ref) {
	  var metersPerLat = _ref.metersPerLat;
	  var metersPerLon = _ref.metersPerLon;
	  return sqrt(sqr((a.lat - b.lat) * metersPerLat) + sqr((a.lon - b.lon) * metersPerLon));
	};
	
	var calcDistanceToOther = function calcDistanceToOther(a, b, city) {
	  return a === b ? Infinity : calcDistanceInMeters(a, b, city);
	};
	
	function calcRace(coords, metersPerDegrees) {
	  var nearestNeighbors = coords.map(function (p1) {
	    return min.apply(undefined, _toConsumableArray(coords.map(function (p2) {
	      return calcDistanceToOther(p1, p2, metersPerDegrees);
	    })));
	  });
	  var avg = mean(nearestNeighbors);
	  var std = stdDevByMean(nearestNeighbors, avg);
	  return mean(nearestNeighbors.filter(function (dist) {
	    return dist >= avg - std && dist <= avg + std;
	  }));
	}
	
	function generateReachChart(_ref2, _ref3, options) {
	  var grp = _ref2.grp;
	  var race = _ref2.race;
	  var square = _ref2.square;
	  var flatness = _ref2.flatness;
	  var cityRace = _ref3.race;
	  var citySquare = _ref3.square;
	
	  // FIXME: next line should be in arguments, but v8 will support it in next version
	
	  var _ref4 = options || {};
	
	  var _ref4$days = _ref4.days;
	  var days = _ref4$days === undefined ? 30 : _ref4$days;
	  var _ref4$frequency = _ref4.frequency;
	  var frequency = _ref4$frequency === undefined ? 100 : _ref4$frequency;
	
	  var RACE_C = 0.07;
	  var LAMBDA_C = 0.008;
	  var DAY_C = 40.0;
	  var ALPHA_C = 4.0;
	  var reachStart = (1 - exp(-RACE_C * sqrt(sqrt(cityRace / race)))) * grp;
	  var reachEnd = reachStart + (100 - reachStart) * (1 - exp(-days * sqrt(grp * (square / citySquare)) / 100));
	
	  var lambda = sqr(LAMBDA_C * reachEnd);
	  var kDay = DAY_C / reachEnd;
	  var kK = ALPHA_C * flatness * (race / cityRace);
	  var ampl = reachEnd;
	
	  var reach = [];
	  for (var j = 1; j <= days; j++) {
	    var x = 1.0 + j * kDay;
	    var row = reach[j - 1] = [];
	    for (var i = 1; i <= frequency; i++) {
	      var alpha = 1.0 + i * kK;
	      row[i - 1] = ampl * incompletegamma(alpha, lambda * x);
	    }
	  }
	  return reach;
	}
	
	function calcRegionGRP(boards) {
	  return boards.reduce(function (total, _ref5) {
	    var grp = _ref5.grp;
	    var visibility = _ref5.visibility;
	    return total + grp * visibility;
	  }, 0);
	}
	
	function calcSquareAndFlatness(coords, _ref6) {
	  var metersPerLat = _ref6.metersPerLat;
	  var metersPerLon = _ref6.metersPerLon;
	
	  var width = metersPerLat * stdDev(coords.map(function (p) {
	    return p.lat;
	  }));
	  var height = metersPerLon * stdDev(coords.map(function (p) {
	    return p.lon;
	  }));
	  var square = PI * width * height;
	  var flatness = width < height ? width / height : height / width;
	  return { square: square, flatness: flatness };
	}
	
	module.exports = {
	  calcDistanceInMeters: calcDistanceInMeters,
	  calcRegionGRP: calcRegionGRP,
	  calcRace: calcRace,
	  calcSquareAndFlatness: calcSquareAndFlatness,
	  generateReachChart: generateReachChart
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var log = Math.log;
	var exp = Math.exp;
	var abs = Math.abs;
	var floor = Math.floor;
	var round = Math.round;
	var PI = Math.PI;
	
	
	function lngamma(x, sgngam) {
	  var logpi = 1.14472988584940017414;
	  var ls2pi = 0.91893853320467274178;
	  var result = void 0;
	  var a = void 0;
	  var b = void 0;
	  var c = void 0;
	  var p = void 0;
	  var q = void 0;
	  var u = void 0;
	  var w = void 0;
	  var z = void 0;
	  var i = void 0;
	
	  sgngam = 1;
	  if (x < -34.0) {
	    q = -x;
	    w = lngamma(q);
	    p = floor(q);
	    i = round(p);
	    if (i % 2 == 0) {
	      sgngam = -1;
	    } else {
	      sgngam = 1;
	    }
	
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
	
	    if (z < 0) {
	      sgngam = -1;
	      z = -z;
	    } else {
	      sgngam = 1;
	    }
	
	    if (u == 2) {
	      result = log(z);
	      return result;
	    }
	
	    p = p - 2;
	    x = x + p;
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
	    q = q + ((7.9365079365079365079365 * 0.0001 * p - 2.7777777777777777777778 * 0.001) * p + 0.0833333333333333333333) / x;
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
	  var igammaepsilon = 0.000000000000001;
	  var result = void 0;
	  var ans = void 0;
	  var ax = void 0;
	  var c = void 0;
	  var r = void 0;
	
	  if (x <= 0 || a <= 0) {
	    result = 0;
	    return result;
	  }
	
	  if (x > 1 && x > a) {
	    result = 1 - incompletegammac(a, x); // eslint-disable no-use-befor-define
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
	  } while (c / ans > igammaepsilon);
	  result = ans * ax / a;
	  return result;
	}
	
	function incompletegammac(a, x) {
	  var igammaepsilon = 0.000000000000001;
	  var igammabignumber = 4503599627370496.0;
	  var igammabignumberinv = 2.22044604925031308085 * 0.0000000000000001;
	  var result = void 0;
	  var ans = void 0;
	  var ax = void 0;
	  var c = void 0;
	  var yc = void 0;
	  var r = void 0;
	  var t = void 0;
	  var y = void 0;
	  var z = void 0;
	  var pk = void 0;
	  var pkm1 = void 0;
	  var pkm2 = void 0;
	  var qk = void 0;
	  var qkm1 = void 0;
	  var qkm2 = void 0;
	
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
	    yc = y * c;
	    pk = pkm1 * z - pkm2 * yc;
	    qk = qkm1 * z - qkm2 * yc;
	    if (qk != 0) {
	      r = pk / qk;
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
	  lngamma: lngamma,
	  incompletegamma: incompletegamma,
	  incompletegammac: incompletegammac
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var sqrt = Math.sqrt;
	
	var sqr = function sqr(x) {
	  return x * x;
	};
	
	var sum = function sum(arr) {
	  return arr.reduce(function (a, b) {
	    return a + b;
	  }, 0);
	};
	
	var mean = function mean(arr) {
	  return sum(arr) / arr.length;
	};
	
	var variancePopByMean = function variancePopByMean(arr, m) {
	  return mean(arr.map(function (x) {
	    return sqr(x - m);
	  }));
	};
	
	function varianceByMean(arr, m) {
	  var n = arr.length;
	  var v1 = 0;
	  var v2 = 0;
	  for (var i = 0; i < n; i++) {
	    v1 += sqr(arr[i] - m);
	    v2 += arr[i] - m;
	  }
	  v2 = sqr(v2) / n;
	  var res = (v1 - v2) / (n - 1);
	  return res < 0 ? 0 : res;
	}
	
	var stdDevByMean = function stdDevByMean(arr, m) {
	  return sqrt(varianceByMean(arr, m));
	};
	var variance = function variance(arr) {
	  return varianceByMean(arr, mean(arr));
	};
	var stdDev = function stdDev(arr) {
	  return sqrt(variance(arr));
	};
	
	module.exports = {
	  sum: sum,
	  mean: mean,
	  stdDevByMean: stdDevByMean,
	  variancePopByMean: variancePopByMean,
	  stdDev: stdDev
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map