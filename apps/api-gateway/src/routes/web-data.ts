import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import { env } from "../utils/env";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (fastify: FastifyInstance) {
  // Grabs all the top viewed products in our catalog
  fastify.withTypeProvider<ZodTypeProvider>().get('/top-products',
    async (request, reply) => {
      if (env.WEB_TOKEN !== request.headers.authorization) {
        reply.status(401);
        return;
      }

      try {
        const productVisitCounts = await prisma.visit.groupBy({
          by: ['productId'],
          _count: {
            productId: true
          },
          orderBy: { _count: { productId: 'desc' } },
          take: 1000
        });

        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productVisitCounts.map(p => p.productId)
            }
          },
          include: {
            prices: {
              select: { id: true, store: true, size: true, price: true },
              orderBy: { createdAt: 'desc' },
              distinct: ['store', 'size']
            }
          },
        });

        reply.status(200);

        return products;
      } catch {
        reply.status(500);
      }
    }
  );

  // Gets the product of the day
  fastify.withTypeProvider<ZodTypeProvider>().get('/product-of-the-day',
    async (request, reply) => {
      if (env.WEB_TOKEN !== request.headers.authorization) {
        reply.status(401);
        return;
      }

      try {
        const sneakerOfTheDay = await prisma.sneakerOfTheDay.findFirst({
          orderBy: { createdAt: 'desc' },
        });

        if (!sneakerOfTheDay) {
          reply.status(404);
          return;
        }

        const sneaker = await prisma.product.findFirst({
          where: { id: sneakerOfTheDay.productId },
        });

        if (!sneaker) {
          reply.status(404);
          return;
        }

        reply.status(200);

        return sneaker;
      } catch {
        reply.status(500);
      }
    }
  );

  // Get the newly added products
  fastify.withTypeProvider<ZodTypeProvider>().get('/new-products',
    async (request, reply) => {
      if (env.WEB_TOKEN !== request.headers.authorization) {
        reply.status(401);
        return;
      }

      try {
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
          take: 4,
        });

        reply.status(200);

        return products;
      } catch {
        reply.status(500);
      }
    }
  );

  // Get the biggest price jumps
  fastify.withTypeProvider<ZodTypeProvider>().get('/biggest-price-jumps',
    async (request, reply) => {
      if (env.WEB_TOKEN !== request.headers.authorization) {
        reply.status(401);
        return;
      }

      try {
        const pricesWithBiggestChange = await prisma.price.groupBy({
          by: ['productId'],
          _avg: { change: true },
          orderBy: { _avg: { change: 'asc' } },
          take: 4,
        });

        const products = await prisma.product.findMany({
          where: {
            id: { in: pricesWithBiggestChange.map(p => p.productId) }
          }
        });

        reply.status(200);

        return products;
      } catch {
        reply.status(500);
      }
    }
  );

  // Get the biggest price dumps
  fastify.withTypeProvider<ZodTypeProvider>().get('/biggest-price-drops',
    async (request, reply) => {
      if (env.WEB_TOKEN !== request.headers.authorization) {
        reply.status(401);
        return;
      }

      try {
        const pricesWithBiggestChange = await prisma.price.groupBy({
          by: ['productId'],
          _avg: { change: true },
          orderBy: { _avg: { change: 'desc' } },
          take: 4,
        });

        const products = await prisma.product.findMany({
          where: {
            id: { in: pricesWithBiggestChange.map(p => p.productId) }
          }
        });

        reply.status(200);

        return products;
      } catch {
        reply.status(500);
      }
    }
  );
}
