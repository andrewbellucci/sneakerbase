# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl
RUN npm install -g pnpm

RUN npm install -g pnpm@9.1.2
RUN pnpm install
RUN cd apps/website && pnpm build

CMD ["pnpm", "start"]