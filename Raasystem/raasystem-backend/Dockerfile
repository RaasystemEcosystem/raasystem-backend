# Use Node.js 18 LTS as base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy only package.json and lock file for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose backend port
EXPOSE 8000

# Start backend server
CMD ["node", "server.js"]
