import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { JwtStrategy } from './jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        const pathToKeys = './keys'
        const pathToPrivateKey = resolve(pathToKeys, 'private_key.pem')
        const pathToPublicKey = resolve(pathToKeys, 'public_key.pem')
        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: readFileSync(pathToPrivateKey, 'utf8'),
          publicKey: readFileSync(pathToPublicKey, 'utf8'),
        }
      },
    }),
    PassportModule,
  ],
  providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AuthModule {}
