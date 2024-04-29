FROM node:22.0.0-slim as base

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

FROM node:22.0.0-slim as production

WORKDIR /app

COPY --from=base /app ./app/apps/jobs

RUN pnpm run build

# insert variable here for job type ???
CMD ["node", "./dist/jobs.js"]
