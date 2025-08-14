# Use official Node.js image
FROM node:20-alpine

# Install Git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy all source files
COPY . .

# Expose the Next.js dev server port
EXPOSE 3000

# Start Next.js in development mode
CMD ["pnpm", "run", "dev"]