import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number(),
});

export type EnvType = z.infer<typeof EnvSchema>;

export const env: EnvType = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: Number(process.env.PORT),
};

EnvSchema.parse(env);
