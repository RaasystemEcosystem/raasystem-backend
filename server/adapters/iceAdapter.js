// server/adapters/iceAdapter.js
const WebSocket = require('ws');
const EventEmitter = require('events');

class ICEAdapter extends EventEmitter {
    constructor(config) {
        super();
        this.wsUrl = config.wsUrl;
        this.apiKey = config.apiKey || null;
        this.marketData = {};
        this.initWebSocket();
    }

    initWebSocket() {
        this.socket = new WebSocket(this.wsUrl, {
            headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}
        });

        this.socket.on('open', () => {
            console.log('✅ Connected to ICE WebSocket');
            this.subscribeToMarkets(['AAPL', 'TSLA']); 
        });

        this.socket.on('message', (data) => {
            try {
                const parsed = JSON.parse(data);
                this.processMessage(parsed);
            } catch (err) {
                console.error('ICE message parse error:', err);
            }
        });

        this.socket.on('close', () => console.warn('ICE WebSocket disconnected'));
        this.socket.on('error', (err) => console.error('ICE WebSocket error:', err));
    }

    subscribeToMarkets(symbols) {
        const msg = { action: 'subscribe', symbols };
        this.socket.send(JSON.stringify(msg));
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

