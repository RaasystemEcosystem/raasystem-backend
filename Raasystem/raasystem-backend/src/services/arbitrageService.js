const EventEmitter = require('events');

class ArbitrageService extends EventEmitter {
  constructor({ iceAdapter, spreadThreshold }) {
    super();
    this.ice = iceAdapter;
    this.threshold = spreadThreshold;
    this.signals = [];
  }

  checkMarket(symbol, bid, ask) {
    const spread = ask - bid;

    if (spread > this.threshold) {
      const signal = { symbol, bid, ask, spread, time: new Date() };
      this.signals.push(signal);
      this.emit('signal', signal);
    }
  }

  executeTrade(signal) {
    console.log('💰 Executing arbitrage trade:', signal);
  }

  getLatestSignals() {
    return this.signals.slice(-20);
  }
}

module.exports = ArbitrageService;
