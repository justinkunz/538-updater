require('dotenv').config();
const { API, Cache, helpers, logger } = require('./utils');
const config = require('./config.json');

const cache = new Cache();

/**
 * Main function
 * - Checks 538 simulations
 * - Sends SMS updates if odds have updated
 */
const checkOdds = async () => {
  try {
    logger.info('Checking Simulations');

    // Get current simulations
    const simulations = await API.getFteSimulations();

    // Caculate odds
    const odds = {
      national: helpers.calculateOdds(simulations),
      state: helpers.calculateOdds(simulations.map((sim) => sim.states[config.state])),
    };

    // Compare new national & state odds to config threshold
    const [alertNationalOdds, alertStateOdds] = [
      cache.isPastThreshold(odds, 'national'),
      cache.isPastThreshold(odds, 'state'),
    ];

    if (alertNationalOdds || alertStateOdds) {
      logger.info('Odds have changed, updating cache');

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
      await helpers.sendSMSUpdate(odds);
    } else {
      logger.info('Odds have not changed');
    }
  } catch (err) {
    logger.error('An error occurred', err);
  }
};

// Check simulations every X milliseconds
setInterval(checkOdds, config.intervalTime);

logger.info(`Set interval to check 538 odds every ${config.intervalTime}ms`);
