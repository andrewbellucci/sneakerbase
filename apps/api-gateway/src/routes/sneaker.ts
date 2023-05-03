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
        const url = request.query.url;
        const product = await prisma.product.findFirst({
          select: { slug: true, id: true },
          where: {
            OR: [
              { stockXUrl: url },
              { goatUrl: url },
              { flightClubUrl: url },
            ]
          },
        });

        if (!product) {
          reply.status(404);
          return;
        }

        reply.status(200).send({ slug: product.slug });

        // Register visit
        await prisma.visit.create({ data: { productId: product.id } });
      } catch {
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get('/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        })
      }
    },
    async (request, reply) => {
      try {
        const product = await prisma.product.findFirst({
          where: { id: request.params.id },
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
        await prisma.visit.create({ data: { productId: request.params.id } });
      } catch(e) {
        logger.error(e);
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get('/slug/:slug',
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

  fastify.withTypeProvider<ZodTypeProvider>().post('/slug/:slug/visit',
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

  fastify.withTypeProvider<ZodTypeProvider>().get('/search',
    {
      schema: {
        params: z.object({ query: z.string() })
      }
    },
    async (request, reply) => {
      try {
        const products = await prisma.product.findMany({
          where: {
            OR: [
              { title: { search: request.params.query } },
              { make: { search: request.params.query } },
              { slug: { search: request.params.query } },
            ]
          },
          select: { id: true, title: true, make: true, slug: true, previewImageUrl: true, isPlaceholder: true },
          take: 10,
        });

        reply.status(200).send(products);
      } catch(err) {
        reply.status(500);
      }
    }
  );
}
