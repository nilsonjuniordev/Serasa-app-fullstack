# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências do PostgreSQL
RUN apk add --no-cache postgresql-client

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3006

CMD ["node", "dist/main"]