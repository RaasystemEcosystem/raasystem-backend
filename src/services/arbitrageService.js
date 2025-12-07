const EventEmitter = require('events');

class ArbitrageService extends EventEmitter {
  constructor({ alpacaAdapter = null, iceAdapter = null, spreadThreshold = 0.2 }) {
    super();
    this.alpaca = alpacaAdapter;
    this.ice = iceAdapter;
    this.spreadThreshold = spreadThreshold;
    this.latestSignals = {};

    if (this.ice) {
      this.ice.on('marketData', (data) => this.evaluateOpportunity(data.symbol));
    } else {
      console.warn('⚠️ ICE Adapter not provided — arbitrage will use Alpaca only.');
    }
  }

  evaluateOpportunity(symbol) {
    const alpacaQuote = this.alpaca?.getQuote(symbol);
    const iceQuote = this.ice?.getMarketData(symbol);

    if (!alpacaQuote && !iceQuote) return;

    const opportunity = iceQuote ? iceQuote.bid - alpacaQuote?.ask : 0;

    if (opportunity >= this.spreadThreshold) {
      const signal = {
        symbol,
        alpacaAsk: alpacaQuote?.ask,
        iceBid: iceQuote?.bid,
        spread: opportunity,
        timestamp: Date.now()
      };

      this.latestSignals[symbol] = signal;
      console.log(`🚀 Arbitrage opportunity detected for ${symbol}: $${opportunity.toFixed(2)}`);
      this.emit('signal', signal);
    } else {
      delete this.latestSignals[symbol];
    }
  }

  getLatestSignals() {
    return Object.values(this.latestSignals);
  }

  async executeTrade(signal) {
    if (!this.alpaca) return;

    try {
      const order = await this.alpaca.placeOrder(signal.symbol, 1, 'buy', 'market');
      console.log('✅ Alpaca buy executed:', order.id);
    } catch (err) {
      console.error('❌ Failed to execute trade:', err.message);
    }
  }
}

module.exports = ArbitrageService;
