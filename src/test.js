const { calcReach } = require('./reach');
const { cities } = require('./cities');

const boards = [
  /* eslint-disable no-multi-spaces */
  [30.567828, 50.413227,  1.774438, 0.753141],
  [30.467979, 50.449231,  9.614000, 0.511891],
  [30.479726, 50.449231,  9.629906, 0.857260],
  [30.362255, 50.453731,  2.999531, 0.715004],
  [30.368129, 50.453731,  2.865656, 0.870372],
  [30.438611, 50.453731, 10.514563, 0.938558],
  [30.444485, 50.453731, 10.514563, 0.653940],
  [30.450358, 50.453731,  9.629906, 0.861899],
  [30.456232, 50.453731,  9.614000, 0.852882],
  [30.462105, 50.453731,  9.629906, 0.776842],
  [30.374002, 50.458232,  2.999531, 0.877450],
  [30.379876, 50.458232,  5.865188, 0.871876],
  [30.391623, 50.458232,  5.865188, 0.847508],
  [30.397497, 50.458232,  1.667844, 0.899308],
  [30.409244, 50.458232,  6.614688, 0.800080],
  [30.415117, 50.458232,  5.053031, 0.929897],
  [30.420991, 50.458232,  7.669313, 0.849233],
  [30.426864, 50.458232,  5.378938, 0.840257],
  [30.432738, 50.458232,  5.378938, 0.797835],
  /* eslint-enable no-multi-spaces */
].map(([lat, lon, grp, visibility]) => ({ lat, lon, grp, visibility }));

const reach = calcReach(boards, cities.Kiev);
const formattedOut = reach.map(line => line.map(d => d.toFixed(6)).join('\t')).join('\n');
process.stdout.write(`${formattedOut}\n`);
