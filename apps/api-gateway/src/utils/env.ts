import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number(),
  WEB_TOKEN: z.string(),
});

export type EnvType = z.infer<typeof EnvSchema>;

const variables = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: Number(process.env.PORT),
  WEB_TOKEN: process.env.WEB_TOKEN,
};

export const env = EnvSchema.parse(variables);
