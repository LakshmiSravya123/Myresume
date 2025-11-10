# Fly.io Dockerfile for Full-Stack Portfolio
FROM node:20-slim AS base

# Install dependencies for build
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy built files from build stage
COPY --from=base /app/dist ./dist

# Copy other necessary files
COPY attached_assets ./attached_assets

# Expose port
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
