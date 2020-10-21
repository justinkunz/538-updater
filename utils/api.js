const axios = require('axios');

const fteSimulationsUrl =
  'https://projects.fivethirtyeight.com/2020-election-forecast/us_simulations.json';

/**
 * Call to 538 API
 */
const getFteSimulations = async () => {
  const { data: fteResults } = await axios.get(fteSimulationsUrl);
  const { simulations } = fteResults[0];
  return simulations.map((sim) => ({
    ...sim,
    outcome: sim.evs,
  }));
};

module.exports = { getFteSimulations };
