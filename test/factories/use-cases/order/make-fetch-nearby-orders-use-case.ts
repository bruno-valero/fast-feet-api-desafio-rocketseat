import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryOrdersRepository } from 'test/repositories/order-in-memory-repositories/in-memory-orders-repository'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { FetchNearbyOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-nearby-orders-use-case'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'

export function makeFetchNearbyOrdersUseCase(props?: {
  ordersRepositoryAlt?: OrdersRepository
  admsRepositoryAlt?: AdmsRepository
  couriersRepositoryAlt?: CouriersRepository
}) {
  const ordersRepository =
    props?.ordersRepositoryAlt ?? new InMemoryOrdersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()

  const useCase = new FetchNearbyOrdersUseCase(
    ordersRepository,
    admsRepository,
    couriersRepository,
  )

  return {
    useCase,
    dependencies: {
      ordersRepository,
      admsRepository,
      couriersRepository,
    },
  }
}
