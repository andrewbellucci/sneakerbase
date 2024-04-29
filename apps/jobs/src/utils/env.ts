import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  STOCKX_ALGOLIA_APP_ID: z.string(),
  STOCKX_ALGOLIA_API_KEY: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  PROXY_HOST: z.string(),
  PROXY_PORT: z.string(),
  PROXY_USERNAME: z.string(),
  PROXY_PASSWORD: z.string(),
  SENTRY_DSN: z.string(),
});

// TODO: update this to use cloudflare R2

const variables = {
  DATABASE_URL: process.env.DATABASE_URL,
  STOCKX_ALGOLIA_APP_ID: process.env.STOCKX_ALGOLIA_APP_ID,
  STOCKX_ALGOLIA_API_KEY: process.env.STOCKX_ALGOLIA_API_KEY,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  PROXY_HOST: process.env.PROXY_HOST,
  PROXY_PORT: process.env.PROXY_PORT,
  PROXY_USERNAME: process.env.PROXY_USERNAME,
  PROXY_PASSWORD: process.env.PROXY_PASSWORD,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

export const env = EnvSchema.parse(variables);
