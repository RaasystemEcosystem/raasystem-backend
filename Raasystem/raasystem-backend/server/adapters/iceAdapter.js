const EventEmitter = require('events');

class ICEAdapter extends EventEmitter {
  constructor({ wsUrl, apiKey }) {
    super();
    this.wsUrl = wsUrl;
    this.apiKey = apiKey;
    this.subscribedSymbols = [];
    this.marketDataCache = {};
    this.connected = false;

    // For now, ICE connection is bypassed until live
    console.warn('⚠️ ICE Adapter initialized in bypass mode. No live data connected.');
  }

  subscribeToMarkets(symbols = []) {
    this.subscribedSymbols = symbols;
    console.log('📡 ICEAdapter subscription set:', symbols);
  }

  // Fetch market data (stub for now)
  getMarketData(symbol) {
    if (!this.marketDataCache[symbol]) {
      return null;
    }
    return this.marketDataCache[symbol];
  }

  // Mock push data (for testing offline)
  pushMockData(symbol, bid, ask) {
    const data = { symbol, bid, ask };
    this.marketDataCache[symbol] = data;
    this.emit('marketData', data);
  }
}

module.exports = ICEAdapter;
