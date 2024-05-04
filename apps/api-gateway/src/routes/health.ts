import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import {logger} from "@sneakerbase/utils";

export default async function (fastify: FastifyInstance) {
  fastify.get('/',
    async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        reply.status(200);
      } catch (error) {
        logger.error(error);
        reply.status(500);
      }
    }
  );
}
