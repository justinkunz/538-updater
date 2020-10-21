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
  isPastThreshold(odds, type) {
    return (
      Math.abs(this.biden[type] - odds[type].Biden) >= alertThreshold[type] ||
      Math.abs(this.trump[type] - odds[type].Trump) >= alertThreshold[type]
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
