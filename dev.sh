#!/bin/bash

# Check if JWT_SECRET is already set
if [ -z "$JWT_SECRET" ]; then
    echo "JWT_SECRET not set. Generating a new one..."
    JWT_SECRET=$(openssl rand -base64 32)
else
    echo "Using existing JWT_SECRET"
fi

# Check if CSRF_SECRET is already set
if [ -z "$CSRF_SECRET" ]; then
    echo "CSRF_SECRET not set. Generating a new one..."
    CSRF_SECRET=$(openssl rand -base64 32)
else
    echo "Using existing CSRF_SECRET"
fi

# Export secrets
export JWT_SECRET
export CSRF_SECRET

# Create or update .env file
echo "JWT_SECRET=${JWT_SECRET}" > .env
echo "CSRF_SECRET=${CSRF_SECRET}" >> .env

# Add development-specific environment variables
echo "NODE_ENV=development" >> .env
echo "PUBLIC_HTTP_PORT=3080" >> .env
echo "BACKEND_PORT=5000" >> .env
echo "FRONTEND_PORT=3000" >> .env
echo "MONGODB_PORT=27017" >> .env

# Print the environment variables (for debugging)
echo "Development Environment Variables:"
echo "JWT_SECRET: ${JWT_SECRET:0:5}..."
echo "CSRF_SECRET: ${CSRF_SECRET:0:5}..."
echo "NODE_ENV: development"
echo "PUBLIC_HTTP_PORT: 3080"
echo "BACKEND_PORT: 5000"
echo "FRONTEND_PORT: 3000"
echo "MONGODB_PORT: 27017"

# Run docker-compose with development configuration
docker compose --file docker-compose.yml --env-file .env up --build