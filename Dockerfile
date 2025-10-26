# Use official Node.js lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy the rest of the project
COPY . .

# Expose container port
EXPOSE 8000

# Default command (can be overridden by docker-compose)
CMD ["node", "src/server.js"]
