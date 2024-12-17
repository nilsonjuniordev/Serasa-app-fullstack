FROM node:18-alpine

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

EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]