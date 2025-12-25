# Dockerfile for Turborepo monorepo with Prisma support
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* turbo.json ./

# Create directories first
RUN mkdir -p apps/web apps/api packages/database packages/ui packages/eslint-config packages/typescript-config

# Copy all package.json files
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN npm ci --include=dev

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set Prisma binary target for Alpine Linux
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# Remove any existing generated client to avoid conflicts
RUN rm -rf packages/database/generated/client

# Generate Prisma client for the correct platform
RUN npx turbo run db:generate

# Install NestJS CLI globally as backup
RUN npm install -g @nestjs/cli

RUN npx turbo run build

# Backend production image
FROM base AS api
WORKDIR /app

# Set runtime environment for Prisma
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

COPY --from=builder /app ./
# Keep devDependencies for tsx (needed for db:seed)
# RUN npm prune --production

EXPOSE 8000
WORKDIR /app/apps/api
CMD ["npm", "run", "start:prod"]

# Frontend production image
FROM base AS web
WORKDIR /app

COPY --from=builder /app ./
RUN npm prune --production

EXPOSE 3000
WORKDIR /app/apps/web
CMD ["npm", "run", "start"]