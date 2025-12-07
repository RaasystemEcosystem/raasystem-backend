const WebSocket = require('ws');
const EventEmitter = require('events');

class ICEAdapter extends EventEmitter {
    constructor(config) {
        super();
        this.wsUrl = config.wsUrl;
        this.apiKey = config.apiKey || null;
        this.marketData = {};
        this.socket = null;
        this.subscribedSymbols = [];
        this.reconnectDelay = 5000;
        this.initWebSocket();
    }

    initWebSocket() {
        console.log(`🔗 Connecting to ICE WebSocket at ${this.wsUrl}...`);
        this.socket = new WebSocket(this.wsUrl, {
            headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}
        });

        this.socket.on('open', () => {
            console.log('✅ Connected to ICE WebSocket');
            this.emit('open');
            if (this.subscribedSymbols.length > 0) {
                this.subscribeToMarkets(this.subscribedSymbols);
            }
        });

        this.socket.on('message', (data) => {
            try {
                const parsed = JSON.parse(data);
                this.processMessage(parsed);
            } catch (err) {
                console.error('ICE message parse error:', err.message);
            }
        });

        this.socket.on('close', () => {
            console.warn('⚠️ ICE WebSocket disconnected. Reconnecting in 5s...');
            setTimeout(() => this.initWebSocket(), this.reconnectDelay);
        });

        this.socket.on('error', (err) => {
            console.error('ICE WebSocket error:', err.message);
        });
    }

    subscribeToMarkets(symbols) {
        this.subscribedSymbols = symbols;

        if (this.socket.readyState === WebSocket.OPEN) {
            const msg = { action: 'subscribe', symbols };
            this.socket.send(JSON.stringify(msg));
            console.log(`📡 Subscribed to markets: ${symbols.join(', ')}`);
        } else {
            console.warn('⚠️ Cannot subscribe yet: WebSocket not open, waiting...');
            this.once('open', () => this.subscribeToMarkets(symbols));
        }
    }

    unsubscribeAll() {
        if (this.socket.readyState === WebSocket.OPEN && this.subscribedSymbols.length > 0) {
            const msg = { action: 'unsubscribe', symbols: this.subscribedSymbols };
            this.socket.send(JSON.stringify(msg));
            this.subscribedSymbols = [];
            console.log('📡 Unsubscribed from all markets');
        }
    }

    processMessage(msg) {
        if (!msg.symbol) return;
        this.marketData[msg.symbol] = msg;
        this.emit('marketData', msg);
    }

    getMarketData(symbol) {
        return this.marketData[symbol] || null;
    }
}

module.exports = ICEAdapter;
