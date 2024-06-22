import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envExamplePath = resolve(__dirname, '..', '.env.example')
const envContent = readFileSync(envExamplePath)

const envPath = resolve(__dirname, '..', '.env')
writeFileSync(envPath, envContent)
