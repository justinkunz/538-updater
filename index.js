require('dotenv').config();
const { API, Cache, utils } = require('./utils');
const config = require('./config.json');

const cache = new Cache();

/**
 * Main function
 * - Checks 538 simulations
 * - Sends SMS updates if odds have updated
 */
const checkOdds = async () => {
  try {
    console.log('Checking Simulations');

    // Get current simulations
    const simulations = await API.getFteSimulations();

    // Caculate odds
    const odds = {
      national: utils.calculateOdds(simulations),
      state: utils.calculateOdds(simulations.map((sim) => sim.states[config.state])),
    };

    // Compare new odds to config threshold
    if (cache.isPastThreshold(odds)) {
      console.log('Odds have changed, updating cache');

      // Set cache
      cache.biden = {
        national: odds.national.Biden,
        state: odds.state.Biden,
      };
      cache.trump = {
        national: odds.national.Trump,
        state: odds.state.Trump,
      };

      // Send SMS Update
      await utils.sendSMSUpdate(odds);
    } else {
      console.log('Odds have not changed');
    }
  } catch (err) {
    console.error('An error occurred', err.toString());
  }
};

// Check simulations every X milliseconds
setInterval(checkOdds, config.intervalTime);
