import z from 'zod'

export const envSchema = z.object({
  // APPLICATION PORT
  PORT: z
    .string()
    .default('3000')
    .transform((item) => Number(item))
    .pipe(z.number()),
  // DATABASE (PRISMA)
  DATABASE_URL: z.string(),
  // AUTH (JWT)
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  // UPLOADT (AWS / CLOUDFARE)
  CLOUDFARE_R2_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_STORAGE_API_KEY: z.string(),
  AWS_STORAGE_SECRET_API_KEY: z.string(),
  // CACHE
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
})

export type Env = z.infer<typeof envSchema>
