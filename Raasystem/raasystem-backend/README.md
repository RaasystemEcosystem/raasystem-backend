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
