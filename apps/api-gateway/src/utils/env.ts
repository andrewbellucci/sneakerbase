import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  HOST: z.string(),
  PORT: z.coerce.number(),
  WEB_TOKEN: z.string(),
  SENTRY_DSN: z.string(),
});

export type EnvType = z.infer<typeof EnvSchema>;

const variables = {
  DATABASE_URL: process.env.DATABASE_URL,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  WEB_TOKEN: process.env.WEB_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

export const env = EnvSchema.parse(variables);
