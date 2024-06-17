import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryOrdersRepository } from 'test/repositories/order-in-memory-repositories/in-memory-orders-repository'
import { FindOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/find-order-use-case'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'

export function makeFindOrderUseCase(props?: {
  ordersRepositoryAlt?: OrdersRepository
  admsRepositoryAlt?: AdmsRepository
}) {
  const ordersRepository =
    props?.ordersRepositoryAlt ?? new InMemoryOrdersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()

  const useCase = new FindOrderUseCase(ordersRepository, admsRepository)

  return {
    useCase,
    dependencies: {
      ordersRepository,
      admsRepository,
    },
  }
}
