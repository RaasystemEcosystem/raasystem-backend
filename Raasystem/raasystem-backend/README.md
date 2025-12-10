# Raasystem Unified Backend — Local Test Guide

## Overview

**Raasystem Unified Backend API v1.0.0**  
Unified API powering RaasBridge, RaasPay, RBT, RaasOracle, and general Raasystem services.  
Integrates ICE (commodities), XRP/USDT (payments), RAAS (gold-backed crypto), RST (tokenized stocks), and RBT (RaasBridge Token).

**Local Server URL:** `http://localhost:3007`  
**Swagger UI:** `http://localhost:3007/api/docs`

---

## Local Setup

1. Ensure `.env` is present in the **root folder** (`raasystem-backend/`) with required variables:

```env
MONGO_URI=your_mongo_connection_string
PORT=3007
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
ICE_WS_URL=   # optional
ICE_API_KEY=  # optional
<<<<<<< HEAD

API Endpoints

| Module                    | Endpoint                 | Method | Description                                                 |
| ------------------------- | ------------------------ | ------ | ----------------------------------------------------------- |
| **General**               | `/api/raas/status`       | GET    | Check backend status                                        |
| **RBT**                   | `/api/rbt/status`        | GET    | Check RBT module status                                     |
| **RBT**                   | `/api/rbt`               | GET    | List all RBT holdings (optional `?wallet_address=0x123...`) |
| **RBT**                   | `/api/rbt/mint`          | POST   | Mint new RBT                                                |
| **RBT**                   | `/api/rbt/burn`          | POST   | Burn RBT                                                    |
| **RBT**                   | `/api/rbt/adjust`        | POST   | Adjust RBT composition                                      |
| **RBT**                   | `/api/rbt/value`         | GET    | Get aggregated RBT value                                    |
| **RBT**                   | `/api/rbt/composition`   | GET    | Get aggregated composition                                  |
| **Raaspay**               | `/api/raaspay/health`    | GET    | Health check                                                |
| **Raaspay**               | `/api/raaspay/payments`  | GET    | List payments                                               |
| **Raaspay**               | `/api/raaspay/transfer`  | POST   | Create new payment                                          |
| **Oracle**                | `/api/oracle/price`      | GET    | Latest gold price                                           |
| **Arbitrage**             | `/api/arbitrage/signals` | GET    | Latest arbitrage signals                                    |
| **Stocks (ICE / Alpaca)** | `/api/stocks/price`      | GET    | Get stock price (e.g., `?symbol=AAPL`)                      |
| **Stocks**                | `/api/stocks/order`      | POST   | Place stock order                                           |
| **ICE**                   | `/api/ice/markets`       | GET    | Commodity market data                                       |
| **XRP Payment**           | `/api/xrp/transfer`      | POST   | XRP transfer                                                |
| **USDT Payment**          | `/api/usdt/transfer`     | POST   | USDT transfer                                               |
| **RAAS**                  | `/api/raaskoin/price`    | GET    | Current RAAS price                                          |
| **RAAS Mint**             | `/api/raaskoin/mint`     | POST   | Mint gold-backed crypto                                     |
| **RAAS Burn**             | `/api/raaskoin/burn`     | POST   | Redeem gold                                                 |
| **RAAS Convert**          | `/api/raaskoin/convert`  | POST   | RAAS ↔ RBT or USDT conversion                               |
| **RST**                   | `/api/rst/portfolio`     | GET    | View tokenized stock portfolio                              |
| **RST Mint**              | `/api/rst/mint`          | POST   | Tokenize stocks                                             |
| **RST Redeem**            | `/api/rst/redeem`        | POST   | Redeem tokenized stocks                                     |
| **RST Price**             | `/api/rst/price`         | GET    | Portfolio valuation                                         |
| **RBT Balance**           | `/api/rbt/balance`       | GET    | Wallet RBT balance                                          |
| **RBT Transfer**          | `/api/rbt/transfer`      | POST   | Move RBT between wallets                                    |
| **RBT Supply**            | `/api/rbt/supply`        | GET    | Total RBT supply                                            |
=======
>>>>>>> ecca5b6 (Unified Backend clean production build)
