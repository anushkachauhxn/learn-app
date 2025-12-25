# Docker Setup for Learn App

This guide explains how to run the entire Learn App (frontend, backend, and PostgreSQL) using Docker Compose.

## Quick Start

### 1. Production Setup (Recommended)

Start all services (frontend, backend, and PostgreSQL):

```bash
docker compose up --build
```

This will:
- Build the frontend and backend applications
- Start a PostgreSQL database
- Run database migrations
- Start all services

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- PostgreSQL: localhost:5432

### 2. Development Setup (with migrations)

For development with automatic database setup:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: Database connection string
- `NEXT_PUBLIC_API_URL`: API URL for the frontend

## Manual Database Operations

If you need to run database migrations manually:

```bash
# Run migrations
docker compose exec api npm run db:migrate

# Generate Prisma client
docker compose exec api npm run db:generate

# Seed the database (if seed file exists)
docker compose exec api npm run db:seed
```

## Project Structure

This is a Turborepo monorepo with:
- `apps/web/` - Next.js frontend
- `apps/api/` - NestJS backend API
- `packages/database/` - Prisma database configuration
- `packages/ui/` - Shared UI components

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Restart database service
docker compose restart postgres
```

### Build Issues
```bash
# Clean build (remove all containers and rebuild)
docker compose down -v
docker compose up --build
```

### Port Conflicts
If ports 3000, 8000, or 5432 are already in use, modify the ports in `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "3001:3000"  # Change first number to available port
```

## Useful Commands

```bash
# Start services in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Remove all data (including database)
docker compose down -v

# Rebuild specific service
docker compose build web
docker compose up web
```

## Architecture

The Docker setup uses:
1. **Single Multi-stage Dockerfile**: Builds all services with proper Turborepo support
2. **PostgreSQL**: Local database for development/testing
3. **Prisma Integration**: Handles database migrations and seeding automatically
4. **Shared packages**: Turborepo handles internal dependencies
5. **Health checks**: Ensures database is ready before starting apps

## Production Deployment

For production deployment:
1. Update environment variables in `.env`
2. Configure proper PostgreSQL connection
3. Use production docker-compose.yml
4. Consider using Docker Swarm or Kubernetes for scaling