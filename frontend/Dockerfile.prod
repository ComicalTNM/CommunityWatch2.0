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

# Build shared and frontend
RUN npm run build -w shared && npm run build -w frontend

EXPOSE 3000

CMD ["npm", "run", "start:frontend"]