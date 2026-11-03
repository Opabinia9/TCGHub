import { z } from 'zod';

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().regex(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{4}/, {
    message: 'Invalid Internal IP',
  }),
});

export type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
