FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching — only re-runs if package.json changes)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

# Default command; overridden per-service in docker-compose.yml
CMD ["node", "index.js"]