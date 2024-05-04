FROM node:21-slim as base

WORKDIR /app

COPY . .
RUN apt-get update -y && apt-get install -y openssl python3
RUN npm install -g pnpm@8.10.2
RUN pnpm install
RUN cd apps/jobs && pnpm build

CMD ["node", "apps/jobs/dist/job.js"]
