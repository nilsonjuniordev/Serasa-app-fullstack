FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ajusta a URL da API para produção
ENV REACT_APP_API_URL=http://147.79.83.158:3006

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]