FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN npm config set strict-ssl false && npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "dev"]
