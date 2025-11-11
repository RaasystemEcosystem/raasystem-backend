const EventEmitter = require('events');
const Alpaca = require('@alpacahq/alpaca-trade-api');

class AlpacaAdapter extends EventEmitter {
  constructor(config = {}) {
    super();
    this.alpaca = new Alpaca({
      keyId: config.keyId || process.env.ALPACA_KEY,
      secretKey: config.secretKey || process.env.ALPACA_SECRET,
      paper: config.paper ?? true,
      usePolygon: false,
      baseUrl: config.baseUrl || process.env.APCA_API_BASE_URL
    });

    this.quoteCache = {}; // store latest quotes
    this.retryLimit = config.retryLimit || 3;

    this.initWebSocket();
  }

  // ---------------- Wrapped Order Placement ----------------
  async placeOrder(symbol, qty, side = 'buy', type = 'market', attempt = 1) {
    try {
      const order = await this.alpaca.createOrder({
        symbol,
        qty,
        side,
        type,
        time_in_force: 'day'
      });
      return order;
    } catch (err) {
      if (attempt <= this.retryLimit) {
        console.warn(`Retrying order ${symbol}, attempt ${attempt}`);
        return this.placeOrder(symbol, qty, side, type, attempt + 1);
      } else {
        console.error(`Order failed after ${this.retryLimit} attempts`);
        throw err;
      }
    }
  }

  async cancelOrder(orderId) {
    try {
      return await this.alpaca.cancelOrder(orderId);
    } catch (err) {
      console.error('Order cancellation failed:', err);
      throw err;
    }
  }

  // ---------------- WebSocket Streaming ----------------
  initWebSocket() {
    if (!this.alpaca.data_stream_v2) return;

    const socket = this.alpaca.data_stream_v2;

    socket.onConnect(() => {
      console.log('✅ Alpaca WebSocket connected');
      socket.subscribeForQuotes(['AAPL', 'TSLA', 'GOOGL']); // default symbols
    });

    socket.onStockQuote((quote) => {
      this.quoteCache[quote.symbol] = quote;
      this.emit('quote', quote);
    });

    socket.onDisconnect(() => console.warn('⚠️ Alpaca WebSocket disconnected'));
    socket.onError(err => console.error('WebSocket error:', err));

    socket.connect();
  }

  getQuote(symbol) {
    return this.quoteCache[symbol] || null;
  }
}

module.exports = AlpacaAdapter;
