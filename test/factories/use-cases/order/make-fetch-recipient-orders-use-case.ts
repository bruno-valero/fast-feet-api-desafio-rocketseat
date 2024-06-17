import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryOrdersRepository } from 'test/repositories/order-in-memory-repositories/in-memory-orders-repository'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { FetchRecipientOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-recipient-orders-use-case'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/recipient-in-memory-repositories/in-memory-recipients-repository'

export function makeFetchRecipientOrdersUseCase(props?: {
  ordersRepositoryAlt?: OrdersRepository
  admsRepositoryAlt?: AdmsRepository
  recipientsRepositoryAlt?: RecipientsRepository
}) {
  const ordersRepository =
    props?.ordersRepositoryAlt ?? new InMemoryOrdersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const recipientsRepository =
    props?.recipientsRepositoryAlt ?? new InMemoryRecipientsRepository()

  const useCase = new FetchRecipientOrdersUseCase(
    ordersRepository,
    admsRepository,
    recipientsRepository,
  )

  return {
    useCase,
    dependencies: {
      ordersRepository,
      admsRepository,
      recipientsRepository,
    },
  }
}
