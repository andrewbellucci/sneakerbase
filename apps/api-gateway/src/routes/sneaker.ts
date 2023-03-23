import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import z from 'zod';
import { ZodTypeProvider } from "fastify-type-provider-zod";
import slugify from "slugify";
import { logger, promiseAllInBatches } from "@sneakerbase/utils";

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
        let product = await prisma.product.findFirst({
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

        reply.status(200);

        return product;
      } catch {
        reply.status(500);
      }
    }
  );
}
