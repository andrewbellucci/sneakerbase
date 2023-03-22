import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";

export default async function (fastify: FastifyInstance) {
  fastify.get('/',
    async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        reply.status(204);
      } catch {
        reply.status(500);
      }
    }
  );
}

