import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipients-repository'
import { FindRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/find-recipient-use-case'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'

export function makeFindRecipientUseCase(props?: {
  recipientsRepositoryAlt?: RecipientsRepository
  admsRepositoryAlt?: AdmsRepository
}) {
  const recipientsRepository =
    props?.recipientsRepositoryAlt ?? new InMemoryRecipientsRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()

  const useCase = new FindRecipientUseCase(recipientsRepository, admsRepository)

  return {
    useCase,
    dependencies: {
      recipientsRepository,
      admsRepository,
    },
  }
}
