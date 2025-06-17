# Build stage
FROM node:22-alpine AS install

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
FROM install AS builder

RUN yarn build

# Development stage
FROM install AS development

CMD yarn typeorm:migrate; yarn start:dev

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies only
RUN yarn install --production; yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application
CMD yarn typeorm:migrate:prod; yarn start:prod