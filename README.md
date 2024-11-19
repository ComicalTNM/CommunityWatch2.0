# CommunityWatch - Team Documentation

Welcome to the CommunityWatch development team! This README provides essential information for setting up and contributing to the project.

## 🚀 Quick Start

### Development Environment

Choose one of these methods to start developing:

1. **GitHub Codespaces** (Recommended for quick start)
   - Open directly in browser
   - Limited to ~60 hours/month on free tier
   - No local setup required

2. **Local Development with VS Code**
   - Requires Docker installation
   - Requires VS Code with "Dev Containers" extension
   - No time limitations

### Prerequisites for Local Development

- Docker Desktop installed and running
- Visual Studio Code
- VS Code "Dev Containers" extension by Microsoft

### Running the Application

#### Development Mode
Deployment mode is set up so that you can edit your code and it will display (almost) immediately without needing to reload.
```bash
# Start all services with live reload
docker compose up --build
```

#### Production Testing
Production mode builds all dependencies in production mode. There is no live reload in this setting. These are the settings that will be
deployed for the web.
```bash
# Test production configuration
docker compose --file docker-compose.prod.yml up --build
```

## 🛠 Technology Stack

- **Backend**: ExpressJS with TypeScript
- **Frontend**: Next.js with TypeScript
- **Database**: 
  - Planned: PostgreSQL, Redis
- **Infrastructure**:
  - Docker for containerization
  - Nginx for reverse proxy

## 📦 Project Structure

```bash
CommunityWatch/
├── backend/                    # Express.js backend
├── frontend/                   # Next.js frontend
├── shared/                     # Shared types and utilities
├── docker/                     # Docker configuration files for dependencies
└── docker-compose.yml          # Docker compose file for development only!
└── docker-compose.prod.yml     # Docker compose file for production (or testing prod)
```

## 🔧 Development Setup

1. **Open in Development Container**
   - VS Code: Look for "Open in Container" prompt or:
     - Press `Ctrl + Shift + P`
     - Type "Dev Containers: Reopen in Container"
     - **NOTE:** For Codespace, it will be "Codespaces: Reopen in Container" (or something similar).
   - Wait for container build to complete

2. **Start Development Server**
```bash
   # From project root
   docker compose up --build
``` 

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - Nginx (Production): `http://localhost:3080`

## 🔍 Important Notes

- Always develop inside the dev container to ensure consistency
- Live reload is enabled in development mode
- Production testing uses different configurations (see docker-compose.prod.yml)
- MongoDB will be replaced with PostgreSQL in future updates

## 💡 IDE Support

- **VS Code**: Fully supported with dev containers
- **JetBrains IDEs**: Supported through [Dev Containers integration](https://www.jetbrains.com/help/idea/connect-to-devcontainer.html) (not recommended)

## 🤝 Contributing

1. Always work in the dev container
2. Make changes and see them live in development mode
3. Test in production mode before submitting PRs
4. Keep dependencies updated and consistent

## ⚠️ Common Issues

1. **Docker not running**
   - Ensure Docker Desktop is running before opening dev container

2. **Port conflicts**
   - This means that a docker container is already running.
   - Run `docker ps` to see the running containers. Find the container and remove it with `docker rm [partial or full container id or name]`

3. **Codespace Hours**
   - Monitor your GitHub Codespaces hours usage
   - Switch to local development if approaching limit