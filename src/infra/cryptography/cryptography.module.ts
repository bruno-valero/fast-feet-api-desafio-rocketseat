import { Module } from '@nestjs/common'
import { BcryptEncrypter } from './bcrypt-encrypter'
import { JwtEncoder } from './jwt-encoder'
import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { Encoder } from '@/domain/core/deliveries-and-orders/application/cryptography/encoder'

@Module({
  providers: [
    { provide: Encrypter, useClass: BcryptEncrypter },
    { provide: Encoder, useClass: JwtEncoder },
  ],
  exports: [Encrypter, Encoder],
})
export class CryptographyModule {}
