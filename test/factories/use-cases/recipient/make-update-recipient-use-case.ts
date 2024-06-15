import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { UpdateRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/update-recipient-use-case'
import { InMemoryRecipientsRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipients-repository'
import { RecipientUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipient-updates-repository'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'
import { InMemoryRecipientUpdatesRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipient-updates-repository'

export function makeUpdateRecipientUseCase(props?: {
  recipientsRepositoryAlt?: RecipientsRepository
  admsRepositoryAlt?: AdmsRepository
  encrypterAlt?: Encrypter
  recipientUpdatesRepositoryAlt?: RecipientUpdatesRepository
}) {
  const recipientsRepository =
    props?.recipientsRepositoryAlt ?? new InMemoryRecipientsRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const recipientUpdatesRepository =
    props?.recipientUpdatesRepositoryAlt ??
    new InMemoryRecipientUpdatesRepository()

  const useCase = new UpdateRecipientUseCase(
    recipientsRepository,
    admsRepository,
    recipientUpdatesRepository,
  )

  return {
    useCase,
    dependencies: {
      recipientsRepository,
      admsRepository,
      recipientUpdatesRepository,
    },
  }
}
