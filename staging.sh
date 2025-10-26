#!/bin/sh
# -----------------------------
# RRWA Staging Workflow Script
# -----------------------------
# Requirements:
# - Docker & docker-compose installed
# - .env configured for Apothem testnet and Alpaca sandbox
# -----------------------------

echo "1️⃣ Building Docker image..."
docker-compose build

echo "2️⃣ Starting backend container..."
docker-compose up -d

# Wait a few seconds for backend to start
echo "⏳ Waiting 5 seconds for backend to initialize..."
sleep 5

# Test /api/rrwa/mint endpoint
TEST_TO_ADDRESS="xdc1234567890abcdef1234567890abcdef1234"
TEST_AMOUNT="1"
TEST_REQUEST_ID="staging-test-$(date +%s)"

echo "3️⃣ Sending test mint request..."
curl -X POST http://localhost:5000/api/rrwa/mint \
-H "Content-Type: application/json" \
-d "{\"to\":\"$TEST_TO_ADDRESS\",\"amount\":$TEST_AMOUNT,\"requestId\":\"$TEST_REQUEST_ID\"}"

echo "\n✅ Staging workflow complete."
echo "Check backend logs: docker-compose logs -f"
