import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async hash(plainText: string): Promise<string> {
    return plainText.concat('-hashed')
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return plainText.concat('-hashed') === hash
  }
}
