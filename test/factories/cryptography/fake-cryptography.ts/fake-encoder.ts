import { Encoder } from '@/domain/core/deliveries-and-orders/application/cryptography/encoder'

export class FakeEncoder extends Encoder {
  async encode(payload: Record<string, unknown>): Promise<string> {
    return payload.sub as string
  }
}
