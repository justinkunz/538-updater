const NodeCache = require('node-cache');
const config = require('../config.json');
const logger = require('./logger');
const nodeCache = new NodeCache();

class Cache {
  #biden;
  #trump;
  constructor() {
    this.#biden = 'odds_biden';
    this.#trump = 'odds_trump';

    const defaultOdds = { national: 0, state: 0 };

    // Set initial odds value
    nodeCache.set(this.#biden, defaultOdds);
    nodeCache.set(this.#trump, defaultOdds);
  }

  // Check if difference in current odds & cached odds surpass alertThreshold
  isPastThreshold(odds, type) {
    return (
      Math.abs(this.biden[type] - odds[type].Biden) >= config.alertThreshold[type] ||
      Math.abs(this.trump[type] - odds[type].Trump) >= config.alertThreshold[type]
    );
  }

  // Biden
  get biden() {
    return nodeCache.get(this.#biden);
  }
  set biden(val) {
    logger.info(
      `Updating Biden's Odds. National: ${this.biden.national}% -> ${val.national}% & State (${config.state}): ${this.biden.state} -> ${val.state}`
    );
    return nodeCache.set(this.#biden, val);
  }

  // Trump∂
  get trump() {
    return nodeCache.get(this.#trump);
  }
  set trump(val) {
    logger.info(
      `Updating Trump's Odds. National: ${this.trump.national}% -> ${val.national}% & State (${config.state}): ${this.trump.state} -> ${val.state}`
    );
    return nodeCache.set(this.#trump, val);
  }
}

module.exports = Cache;
