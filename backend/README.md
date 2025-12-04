# Raasystem Backend

This is the backend of the Raasystem ecosystem, handling APIs, logic, integrations, and data flow for:
- RABEX AI Trading
- Raaspay Crypto-to-Fiat Gateway
- Raaswallet Integration
- Gold Price Oracle (via Chainlink feed)

## Structure

- `controllers/`: Handles HTTP request logic.
- `routes/`: API route definitions.
- `services/`: Business logic & integrations.
- `utils/`: Helpers and utilities.

## Environment Setup

- Node.js 18+
- Create `.env` file with necessary secrets

## Start Locally

```bash
npm install
npm start
