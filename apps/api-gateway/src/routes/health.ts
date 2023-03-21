import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";

export default async function (fastify: FastifyInstance) {
  fastify.post('/',
    async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        reply.status(200);
        return { status: 'ok' };
      } catch {
        reply.status(500);
        return { status: 'error' };
      }
    }
  );
}
