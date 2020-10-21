const NodeCache = require('node-cache');
const { alertThreshold } = require('../config.json');
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
  isPastThreshold(odds) {
    return (
      Math.abs(this.biden.national - odds.national.Biden) >= alertThreshold.national ||
      Math.abs(this.trump.national - odds.national.Trump) >= alertThreshold.national ||
      Math.abs(this.biden.state - odds.state.Biden) >= alertThreshold.state ||
      Math.abs(this.trump.state - odds.state.Trump) >= alertThreshold.state
    );
  }

  // Biden
  get biden() {
    return nodeCache.get(this.#biden);
  }
  set biden(val) {
    return nodeCache.set(this.#biden, val);
  }

  // Trump
  get trump() {
    return nodeCache.get(this.#trump);
  }
  set trump(val) {
    return nodeCache.set(this.#trump, val);
  }
}

module.exports = Cache;
