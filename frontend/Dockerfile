FROM node:20

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY frontend ./frontend
COPY shared ./shared

# Build shared
RUN npm run build -w shared

EXPOSE 3000

CMD ["npm", "run", "dev", "-w", "frontend"]