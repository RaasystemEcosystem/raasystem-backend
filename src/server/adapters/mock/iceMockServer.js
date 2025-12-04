// src/server/mock/iceMockServer.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });
console.log('🧩 Mock ICE WebSocket server running on ws://localhost:8081');

wss.on('connection', (ws) => {
    console.log('✅ Mock client connected');
    
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        if (data.action === 'subscribe' && data.symbols) {
            console.log(`📡 Client subscribed to: ${data.symbols.join(', ')}`);
        }
    });

    // Simulate live price updates
    setInterval(() => {
        const symbols = ['AAPL', 'TSLA', 'GOOGL'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const bid = (100 + Math.random() * 50).toFixed(2);
        const ask = (bid * 1.001).toFixed(2);

        const update = { symbol, bid, ask, timestamp: Date.now() };
        ws.send(JSON.stringify(update));
    }, 2000);
});
