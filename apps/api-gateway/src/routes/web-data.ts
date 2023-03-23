import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import { env } from "../utils/env";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get('/top-products',
    async (request, reply) => {
      if (env.WEB_TOKEN !== request.headers.authorization) {
        reply.status(401);
        return;
      }

      try {
        // const products = await prisma.product.groupBy({
        //   orderBy: { visits: 'desc' },
        //   include: {
        //     prices: {
        //       select: { id: true, store: true, size: true, price: true },
        //       orderBy: { createdAt: 'desc' },
        //       distinct: ['store', 'size']
        //     }
        //   },
        //   having: { visits: { gt: 0 } },
        //   take: 1000
        // });

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
}
