FROM node:21-slim as base

WORKDIR /app

COPY . .
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm@9.1.2
RUN pnpm install
RUN cd apps/api-gateway && pnpm build

ENV HOST=0.0.0.0 PORT=3000

EXPOSE 3000

CMD ["node", "apps/api-gateway/dist/index.js"]
