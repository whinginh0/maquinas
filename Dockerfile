FROM node:18-alpine

WORKDIR /app

# Copia os arquivos do package.json e package-lock.json
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --production

# Copia todo o restante do código da aplicação
COPY . .

# Expor a porta padrão (o EasyPanel roteará o tráfego HTTP para cá)
EXPOSE 80

# Inicia o servidor Node.js
CMD ["node", "server.js"]
