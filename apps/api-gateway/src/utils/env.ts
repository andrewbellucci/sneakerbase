import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number(),
});

export type EnvType = z.infer<typeof EnvSchema>;

const variables = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: Number(process.env.PORT),
};

export const env = EnvSchema.parse(variables);
