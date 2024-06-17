import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryOrdersRepository } from 'test/repositories/order-in-memory-repositories/in-memory-orders-repository'
import { OrderUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-updates-repository'
import { InMemoryOrderUpdatesRepository } from 'test/repositories/order-in-memory-repositories/in-memory-order-updates-repository'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { CollectOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/collect-order-use-case'

export function makeCollectOrderUseCase(props?: {
  ordersRepositoryAlt?: OrdersRepository
  admsRepositoryAlt?: AdmsRepository
  orderUpdatesRepositoryAlt?: OrderUpdatesRepository
}) {
  const ordersRepository =
    props?.ordersRepositoryAlt ?? new InMemoryOrdersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const orderUpdatesRepository =
    props?.orderUpdatesRepositoryAlt ?? new InMemoryOrderUpdatesRepository()

  const useCase = new CollectOrderUseCase(
    ordersRepository,
    admsRepository,
    orderUpdatesRepository,
  )

  return {
    useCase,
    dependencies: {
      ordersRepository,
      admsRepository,
      orderUpdatesRepository,
    },
  }
}
