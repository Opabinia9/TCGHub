import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().int().min(1).max(65535),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.coerce.number().int().min(1).max(65535),
  POSTGRES_URL: z.string(),
  POSTGRES_DATABASE: z.string(),
  DATABASE_URL: z.string(),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
