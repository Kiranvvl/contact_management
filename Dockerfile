FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install ALL dependencies (including dev for TypeScript)
RUN npm install

# Copy source code
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
