FROM node:21 as base

WORKDIR /app

COPY . .

RUN npm install -g pnpm@8.10.2
RUN pnpm install
RUN cd apps/jobs && pnpm build

FROM node:21-slim as production

WORKDIR /app

COPY --from=base /app/apps/jobs .

CMD ["node", "dist/job.js"]
