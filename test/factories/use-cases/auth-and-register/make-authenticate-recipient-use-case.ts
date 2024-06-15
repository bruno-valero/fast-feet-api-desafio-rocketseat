import { Encoder } from '@/domain/core/deliveries-and-orders/application/cryptography/encoder'
import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AuthenticateRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/recipient/authenticate-recipient-use-case'
import { InMemoryRecipientsRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipients-repository'
import { FakeEncrypter } from '../../cryptography/fake-cryptography.ts/fake-encripter'
import { FakeEncoder } from '../../cryptography/fake-cryptography.ts/fake-encoder'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'

export function makeAuthenticateRecipientUseCase(props?: {
  recipientsRepositoryAlt?: RecipientsRepository
  encrypterAlt?: Encrypter
  encoderAlt?: Encoder
}) {
  const recipientsRepository =
    props?.recipientsRepositoryAlt ?? new InMemoryRecipientsRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()
  const encoder = props?.encoderAlt ?? new FakeEncoder()

  const useCase = new AuthenticateRecipientUseCase(
    recipientsRepository,
    encrypter,
    encoder,
  )

  return {
    useCase,
    dependencies: {
      recipientsRepository,
      encrypter,
      encoder,
    },
  }
}
