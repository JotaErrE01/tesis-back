import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().transform(Number).refine(port => !isNaN(port) || port > 8000, 'Puerto no válido'),
  DB_USERNAME: z.string().min(2),
  DB_PASSWORD: z.string().min(2),
  DB_NAME: z.string().min(2),
  DB_HOST: z.string().min(2),
  DB_PORT: z.string()
    .optional()
    .default('5432')
    .transform(Number)
    .refine(port => !isNaN(port) || port > 8000, 'Puerto no válido'),
  PASSWORD_SALT: z.string().default('10')
    .transform(Number).refine(salt => !isNaN(salt) || salt > 8000, 'Salt no válido'),
  JWT_SECRET: z.string().min(2),
});


export type Envs = z.infer<typeof envSchema>;

