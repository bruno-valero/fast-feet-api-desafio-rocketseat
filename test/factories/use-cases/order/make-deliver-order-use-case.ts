import { InMemoryOrdersRepository } from 'test/repositories/order-in-memory-repositories/in-memory-orders-repository'
import { OrderUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-updates-repository'
import { InMemoryOrderUpdatesRepository } from 'test/repositories/order-in-memory-repositories/in-memory-order-updates-repository'
import { DeliverOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/deliver-order-use-case'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { AttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/attachments-repository'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'

export function makeDeliverOrderUseCase(props?: {
  ordersRepositoryAlt?: OrdersRepository
  couriersRepositoryAlt?: CouriersRepository
  orderUpdatesRepositoryAlt?: OrderUpdatesRepository
  attachmentsRepositoryAlt?: AttachmentsRepository
}) {
  const ordersRepository =
    props?.ordersRepositoryAlt ?? new InMemoryOrdersRepository()
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const orderUpdatesRepository =
    props?.orderUpdatesRepositoryAlt ?? new InMemoryOrderUpdatesRepository()
  const attachmentsRepository =
    props?.attachmentsRepositoryAlt ?? new InMemoryAttachmentsRepository()

  const useCase = new DeliverOrderUseCase(
    ordersRepository,
    couriersRepository,
    orderUpdatesRepository,
    attachmentsRepository,
  )

  return {
    useCase,
    dependencies: {
      ordersRepository,
      couriersRepository,
      orderUpdatesRepository,
      attachmentsRepository,
    },
  }
}
