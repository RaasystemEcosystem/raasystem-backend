🚀 Raasystem Backend
AI-driven backend for the Raasystem ecosystem — powering trading, oracle services, payments (Raaspay), and integrations with blockchain and AI modules.
Built with Node.js, Express, MongoDB (Mongoose), and Docker for easy deployment.

📦 Project Structure
text
Copy
Edit
├── src/
│   ├── api/                   # Frontend API helpers (if kept here)
│   ├── config/                # Configuration helpers
│   ├── docs/                  # Swagger / OpenAPI specs
│   │   └── swagger.json
│   ├── models/                # Mongoose models (e.g., Payment.js)
│   ├── routes/                # Express routes (e.g., raaspay.js)
│   └── server.js              # Main Express entry point
├── .env.example               # Environment variables template
├── Dockerfile                 # Docker build instructions
├── docker-compose.yml         # Optional Docker multi-service config
├── Procfile                   # Deployment config (Heroku, EB, etc.)
├── package.json
└── README.md                  # This documentation