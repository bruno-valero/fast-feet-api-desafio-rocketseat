import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipients-repository'
import { RecipientUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipient-updates-repository'
import { UpdateRecipientPasswordUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/update-recipient-password-use-case'
import { FakeEncrypter } from 'test/factories/cryptography/fake-cryptography.ts/fake-encripter'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'
import { InMemoryRecipientUpdatesRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipient-updates-repository'

export function makeUpdateRecipientPasswordUseCase(props?: {
  recipientsRepositoryAlt?: RecipientsRepository
  admsRepositoryAlt?: AdmsRepository
  recipientUpdatesRepositoryAlt?: RecipientUpdatesRepository
  encrypterAlt?: Encrypter
}) {
  const recipientsRepository =
    props?.recipientsRepositoryAlt ?? new InMemoryRecipientsRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const recipientUpdatesRepository =
    props?.recipientUpdatesRepositoryAlt ??
    new InMemoryRecipientUpdatesRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()

  const useCase = new UpdateRecipientPasswordUseCase(
    recipientsRepository,
    admsRepository,
    recipientUpdatesRepository,
    encrypter,
  )

  return {
    useCase,
    dependencies: {
      recipientsRepository,
      admsRepository,
      recipientUpdatesRepository,
      encrypter,
    },
  }
}
