import { Encoder } from '@/domain/core/deliveries-and-orders/application/cryptography/encoder'
import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { AuthenticateCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/courier/authenticate-courier-use-case'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { FakeEncrypter } from '../../cryptography/fake-cryptography.ts/fake-encripter'
import { FakeEncoder } from '../../cryptography/fake-cryptography.ts/fake-encoder'

export function makeAuthenticateCourierUseCase(props?: {
  couriersRepositoryAlt?: CouriersRepository
  encrypterAlt?: Encrypter
  encoderAlt?: Encoder
}) {
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()
  const encoder = props?.encoderAlt ?? new FakeEncoder()

  const useCase = new AuthenticateCourierUseCase(
    couriersRepository,
    encrypter,
    encoder,
  )

  return {
    useCase,
    dependencies: {
      couriersRepository,
      encrypter,
      encoder,
    },
  }
}
