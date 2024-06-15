import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { RegisterRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/recipient/register-recipient-use-case'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipients-repository'
import { FakeEncrypter } from '../../cryptography/fake-cryptography.ts/fake-encripter'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'

export function makeRegisterRecipientUseCase(props?: {
  recipientsRepositoryAlt?: RecipientsRepository
  admsRepositoryAlt?: AdmsRepository
  encrypterAlt?: Encrypter
}) {
  const recipientsRepository =
    props?.recipientsRepositoryAlt ?? new InMemoryRecipientsRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()

  const useCase = new RegisterRecipientUseCase(
    recipientsRepository,
    admsRepository,
    encrypter,
  )

  return {
    useCase,
    dependencies: {
      recipientsRepository,
      admsRepository,
      encrypter,
    },
  }
}
