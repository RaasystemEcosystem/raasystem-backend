import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

# Assume you have a function to get your rabex engine status:
# from rabex_engine import get_engine_status

app = FastAPI()

# Allow CORS for frontend dev server (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connected websocket clients
clients = set()

@app.websocket("/ws/rabex-status")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            # Every second, send status to client
            status = get_engine_status()
            await websocket.send_text(json.dumps(status))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        clients.remove(websocket)

# Mock function for demonstration; replace with your actual status getter
def get_engine_status():
    # You should integrate your rabex_engine.py logic here to fetch real-time status
    # For example:
    # return rabex_engine.get_current_status()
    return {
        "predicted_price": 1009.72,
        "spread": 0.2040,
        "order_book": {
            "bid": {"type": "buy", "price": 906.72856, "quantity": 10000},
            "ask": {"type": "sell", "price": 1112.71144, "quantity": 10000}
        },
        "oracle_price": 999.72,
        "rebalance_status": {"USDT": 5000, "RAASKOIN": 5000}
    }
