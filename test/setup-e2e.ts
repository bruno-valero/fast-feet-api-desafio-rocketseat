import { config } from 'dotenv'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

import { PrismaClient } from '@prisma/client'
import { DomainEvents } from '@/core/events/domain-events'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL not found')
const schema = randomUUID()

beforeAll(async () => {
  const url = new URL(DATABASE_URL)
  url.searchParams.set('schema', schema)
  process.env.DATABASE_URL = url.toString()

  DomainEvents.shouldRun = false

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$queryRawUnsafe(`
    DROP SCHEMA IF EXISTS "${schema}" CASCADE
  `)
  await prisma.$disconnect()
})
