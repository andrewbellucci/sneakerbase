import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import pino from "pino";
import {env} from "./utils/env";

async function startServer() {
  try {
    const server = fastify({
      logger: pino({ level: 'info' }),
    });

    // Type Provider
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    // Plugins
    server.register(require('@fastify/cors'), { origin: '*' });
    server.register(require('@fastify/helmet'));

    // Swagger Docs
    server.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Sneakerbase API',
          description: 'The gateway to the Sneakerbase API',
          version: '1.0.0',
        },
        servers: [],
      },
      transform: jsonSchemaTransform,
    });
    server.register(fastifySwaggerUI, { routePrefix: '/docs' });

    // Routes
    server.register(require('./routes/health'), { prefix: '/health' });

    await server.listen(env.PORT, "0.0.0.0");
  } catch (e) {
    console.error(e);
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer().catch(console.error);

