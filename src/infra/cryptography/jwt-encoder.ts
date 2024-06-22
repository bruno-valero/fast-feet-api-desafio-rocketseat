import { Encoder } from '@/domain/core/deliveries-and-orders/application/cryptography/encoder'
import { JwtService } from '@nestjs/jwt'
import { TokenPayload } from '../auth/jwt.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtEncoder implements Encoder {
  constructor(private jwt: JwtService) {}

  async encode(payload: TokenPayload): Promise<string> {
    return this.jwt.sign(payload)
  }
}
