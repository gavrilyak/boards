'exec' //usr/bin/env node --harmony-destructuring "$0" "$@"

const calcReach = require('../build/index');
const cities = require('../src/cities');
const fs = require('fs');

const boards = fs.readFileSync('/dev/stdin')
  .toString()
  .split('\n')
  .filter(line => !!line)
  .map(line => line.split(/,|\t/))
  .map(([lat, lon, grp, visibility]) => ({
    lat: +lat,
    lon: +lon,
    grp: +grp,
    visibility: (+visibility) || 1,
  }));

//console.log(boards);

const reach = calcReach(boards, cities.Kiev, { frequency: 5 });
const formattedOut = reach.map(line => line.map(d => d.toFixed(6)).join('\t')).join('\n');
process.stdout.write(`${formattedOut}\n`);
