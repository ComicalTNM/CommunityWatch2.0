FROM node:20

WORKDIR /app

ARG BACKEND_PORT
ENV BACKEND_PORT=${BACKEND_PORT}

# Copy package.json files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY backend ./backend
COPY shared ./shared

# Build shared and backend
RUN npm run build -w shared && npm run build -w backend

EXPOSE ${BACKEND_PORT}

CMD ["npm", "run", "start:backend"]