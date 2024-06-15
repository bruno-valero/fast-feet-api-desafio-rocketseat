import z from 'zod'

export const envSchema = z.object({
  PORT: z
    .string()
    .default('3000')
    .transform((item) => Number(item))
    .pipe(z.number()),
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
