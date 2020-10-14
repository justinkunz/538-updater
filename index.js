require("dotenv").config();
const axios = require("axios");
const Cache = require("./utils/cache");
const sms = require("./utils/sms");
const CONSTANTS = require("./constants");

const cache = new Cache();

/**
 * Call to 538 API
 */
const getFTEPolls = async () => {
  const { data: ftePolls } = await axios.get(CONSTANTS.FTE_SIMULATIONS_URL);
  const { simulations } = ftePolls[0];
  return simulations.map((sim) => ({
    ...sim,
    outcome: sim.evs,
  }));
};

/**
 * Checks if odds from latest result are different than cached results
 *
 * @param {Object} odds Odds object
 */
const haveOddsChanged = (odds) =>
  cache.bidenNatOdds !== odds.national.Biden ||
  cache.trumpNatOdds !== odds.national.Trump ||
  cache.bidenStateOdds !== odds.state.Biden ||
  cache.trumpStateOdds !== odds.state.Trump;

/**
 * Sets cache (avoids sending duplicate update)
 *
 * @param {Object} odds Odds object
 */
const setOddsCache = (odds) => {
  cache.bidenNatOdds = odds.national.Biden;
  cache.trumpNatOdds = odds.national.Trump;
  cache.bidenStateOdds = odds.state.Biden;
  cache.trumpStateOdds = odds.state.Trump;
};

/**
 * Determine win odds per canidate
 *
 * @param {Array} simulations 538 Simulations
 */
const calculateOdds = (simulations) =>
  simulations.reduce((acc, { winner }) => {
    if (Object.prototype.hasOwnProperty.call(acc, winner)) {
      acc[winner]++;
    } else {
      acc[winner] = 1;
    }
    return acc;
  }, {});

/**
 * Main function
 * - Checks 538 polls
 * - Sends SMS updates if polls have updated
 */
const checkPolls = async () => {
  try {
    console.log("Checking Polls");
    const polls = await getFTEPolls();
    const odds = {
      national: calculateOdds(polls),
      state: calculateOdds(polls.map((sim) => sim.states[CONSTANTS.STATE])),
    };

    if (haveOddsChanged(odds)) {
      console.log("Odds have changed, updating cache");
      setOddsCache(odds);
      await sms.sendUpdate(odds);
    } else {
      console.log("Odds have not changed");
    }
  } catch (err) {
    console.error("An error occurred", err.toString());
  }
};

// Check polls every X milliseconds
setInterval(checkPolls, CONSTANTS.INTERVAL_TIME);
