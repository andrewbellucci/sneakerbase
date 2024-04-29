FROM node:21 as base

WORKDIR /app

COPY . .

RUN npm install -g pnpm@8.10.2
RUN pnpm install

FROM node:21-slim as production

WORKDIR /app

COPY --from=base /app ./app/apps/jobs

RUN npm run build

CMD ["node", "./dist/jobs.js"]
