import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { logger } from "@sneakerbase/utils";
import { Product } from "@sneakerbase/database";
import { differenceInDays } from "date-fns";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        querystring: z.object({
          q: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const query = request.query.q;
        const products = await prisma.product.findMany({
          select: { slug: true, id: true, title: true, previewImageUrl: true },
          where: {
            sku: {
              search: query,
            },
          },
          take: 25,
        });

        reply.status(200).send(products);
      } catch {
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/url-lookup",
    {
      schema: {
        querystring: z.object({
          url: z.string().url(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const url = request.query.url;
        const product = await prisma.product.findFirst({
          select: { slug: true, id: true },
          where: {
            OR: [{ stockXUrl: url }, { goatUrl: url }, { flightClubUrl: url }],
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

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const product = await prisma.product.findFirst({
          where: { id: request.params.id },
          include: {
            prices: {
              select: {
                id: true,
                store: true,
                size: true,
                price: true,
                createdAt: true,
              },
              orderBy: { createdAt: "desc" },
              distinct: ["store", "size"],
            },
          },
        });

        if (!product) {
          reply.status(404);
          return;
        }

        reply.status(200).send(product);

        // Register visit
        await prisma.visit.create({ data: { productId: request.params.id } });

        // Check to see if the product is an old scrape or has no prices
        const pricesNeedUpdates = Math.abs(differenceInDays(product.prices[0]?.createdAt ?? new Date(), new Date())) >= 1
        if (product.prices.length === 0 || pricesNeedUpdates) {
          console.log(product, `pricing needs updating on ${product.id}`)
          await fastify.redis.publish("update-pricing", product.id);
        }
      } catch (e) {
        logger.error(e);
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/slug/:slug",
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const product = await prisma.product.findFirst({
          where: { slug: request.params.slug },
          include: {
            prices: {
              select: {
                id: true,
                store: true,
                size: true,
                price: true,
                createdAt: true,
              },
              orderBy: { createdAt: "desc" },
              distinct: ["store", "size"],
            },
          },
        });

        if (!product) {
          reply.status(404);
          return;
        }

        reply.status(200).send(product);

        // Register visit
        await prisma.visit.create({ data: { productId: product.id } });

        // Check to see if the product is an old scrape or has no prices
        const pricesNeedUpdates = Math.abs(differenceInDays(product.prices[0]?.createdAt ?? new Date(), new Date())) >= 1
        if (product.prices.length === 0 || pricesNeedUpdates) {
          await fastify.redis.publish("update-pricing", product.id);
        }
      } catch {
        reply.status(500);
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/slug/:slug/visit",
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
      },
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

        reply.status(200);
      } catch {
        reply.status(500);
      }
    }
  );

  // fastify
  //   .withTypeProvider<ZodTypeProvider>()
  //   .get("/sneakers-without-prices", async (request, reply) => {
  //     try {
  //       // get products without prices
  //       const products = await prisma.product.findMany({
  //         where: {
  //           prices: {
  //             none: {},
  //           },
  //         },
  //       });
  //
  //       reply.status(200).send(products.length);
  //     } catch (err) {
  //       logger.error(err);
  //       reply.status(500);
  //     }
  //   });
  //
  // fastify
  //   .withTypeProvider<ZodTypeProvider>()
  //   .get("/dump", async (request, reply) => {
  //     try {
  //       // collect products in paginated fashion
  //       const productCount = await prisma.product.count();
  //
  //       const products: {
  //         id: string;
  //         title: string;
  //         slug: string;
  //         colorWay: string;
  //         make: string;
  //         previewImageUrl: string;
  //       }[] = [];
  //
  //       for (let i = 0; i < productCount; i += 10000) {
  //         const productsChunk = await prisma.product.findMany({
  //           skip: i,
  //           take: 10000,
  //           select: {
  //             id: true,
  //             title: true,
  //             slug: true,
  //             colorWay: true,
  //             make: true,
  //             previewImageUrl: true,
  //           },
  //         });
  //
  //         products.push(...productsChunk);
  //       }
  //
  //       reply.status(200).send(products);
  //     } catch (err) {
  //       logger.error(err);
  //       reply.status(500);
  //     }
  //   });
}
