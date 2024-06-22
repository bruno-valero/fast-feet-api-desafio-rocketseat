import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcryptjs'

@Injectable()
export class BcryptEncrypter implements Encrypter {
  hash(painText: string): Promise<string> {
    return hash(painText, 8)
  }

  compare(painText: string, hash: string): Promise<boolean> {
    return compare(painText, hash)
  }
}
