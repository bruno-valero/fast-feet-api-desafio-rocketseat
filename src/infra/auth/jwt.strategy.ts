import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { readFileSync } from 'node:fs'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['recipient', 'adm', 'courier']),
})

export type TokenPayload = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const publicKey = readFileSync('./keys/public_key.pem')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenPayload) {
    return tokenSchema.parse(payload)
  }
}
