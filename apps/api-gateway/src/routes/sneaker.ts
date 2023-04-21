import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import z from 'zod';
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { logger } from "@sneakerbase/utils";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get('/url-lookup',
    {
      schema: {
        querystring: z.object({
          url: z.string().url(),
        })
      }
    },
    async (request, reply) => {
      try {
        const product = await prisma.product.findFirst({
          where: {
            OR: [
              { stockXUrl: request.query.url },
              { goatUrl: request.query.url },
              { flightClubUrl: request.query.url },
            ]
          },
          include: {
            prices: {
              select: { id: true, store: true, size: true, price: true },
              orderBy: { createdAt: 'desc' },
              distinct: ['store', 'size']
            }
          }
        });

        if (!product) {
          reply.status(404);
          return;
        }

        reply.status(200).send(product);

        // Register visit
        await prisma.visit.create({ data: { productId: product.id } });
      } catch {
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get('/:slug',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        })
      }
    },
    async (request, reply) => {
      try {
        const product = await prisma.product.findFirst({
          where: { slug: request.params.slug },
          include: {
            prices: {
              select: { id: true, store: true, size: true, price: true },
              orderBy: { createdAt: 'desc' },
              distinct: ['store', 'size']
            }
          }
        });

        if (!product) {
          reply.status(404);
          return;
        }

        reply.status(200).send(product);

        // Register visit
        await prisma.visit.create({ data: { productId: product.id } });
      } catch {
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().post('/:slug/visit',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        })
      }
    },
    async (request, reply) => {
      try {
        const product = await prisma.product.findFirst({
          where: { slug: request.params.slug },
          select: { id: true },
        });

        if (!product) {
          reply.status(404);
          return;
        }

        // Register visit
        await prisma.visit.create({ data: { productId: product.id } });

        reply.status(200)
      } catch {
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get('/sneakers-without-prices',
    async (request, reply) => {
      try {
        // get products without prices
        const products = await prisma.product.findMany({
          where: {
            prices: { none: {} },
          }
        });

        reply.status(200).send(products.length);
      } catch(err) {
        logger.error(err);
        reply.status(500);
      }
    }
  );
}
