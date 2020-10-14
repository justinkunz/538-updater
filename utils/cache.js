const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

class Cache {
  #bidenNatKey;
  #trumpNatKey;
  #bidenStateKey;
  #trumpStateKey;
  constructor() {
    this.#bidenNatKey = "odds_biden_nat";
    this.#trumpNatKey = "odds_trump_nat";
    this.#bidenStateKey = "odds_biden_state";
    this.#trumpStateKey = "odds_trump_state";
  }

  get bidenNatOdds() {
    return nodeCache.get(this.#bidenNatKey);
  }

  set bidenNatOdds(val) {
    return nodeCache.set(this.#bidenNatKey, val);
  }

  get trumpNatOdds() {
    return nodeCache.get(this.#trumpNatKey);
  }

  set trumpNatOdds(val) {
    return nodeCache.set(this.#trumpNatKey, val);
  }

  get bidenStateOdds() {
    return nodeCache.get(this.#bidenStateKey);
  }

  set bidenStateOdds(val) {
    return nodeCache.set(this.#bidenStateKey, val);
  }

  get trumpStateOdds() {
    return nodeCache.get(this.#trumpStateKey);
  }

  set trumpStateOdds(val) {
    return nodeCache.set(this.#trumpStateKey, val);
  }
}

module.exports = Cache;
