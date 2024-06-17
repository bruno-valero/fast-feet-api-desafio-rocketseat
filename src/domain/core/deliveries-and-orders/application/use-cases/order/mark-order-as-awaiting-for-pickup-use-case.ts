import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrderUpdatesRepository } from '../../repositories/order-repositories/order-updates-repository'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { OrderAwaitingPickupError } from '@/core/errors/errors/order-errors/order-awaiting-for-pickup-error'
import { OrderIsClosedError } from '@/core/errors/errors/order-errors/order-is-closed-error'
import { InternalServerError } from '@/core/errors/errors/internal-server-error'
import { Injectable } from '@nestjs/common'

export interface MarkOrderAsAwaitingForPickupUseCaseRequest {
  orderId: string
  requestResponsibleId: string
}

export type MarkOrderAsAwaitingForPickupUseCaseResponse = Either<
  | ResourceNotFoundError
  | UnauthorizedError
  | OrderAwaitingPickupError
  | OrderIsClosedError
  | InternalServerError,
  null
>

@Injectable()
export class MarkOrderAsAwaitingForPickupUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
    private orderUpdatesRepository: OrderUpdatesRepository,
  ) {}

  async execute({
    orderId,
    requestResponsibleId,
  }: MarkOrderAsAwaitingForPickupUseCaseRequest): Promise<MarkOrderAsAwaitingForPickupUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'set_awaiting_fot_pickup_order',
      adm.role,
    )
    if (!hasPermission) return left(new UnauthorizedError())

    const order = await this.ordersRepository.findById(orderId)
    if (!order) return left(new ResourceNotFoundError())

    const { data, error } = order.actions.adm.admSetAwaitingPickup(
      new UniqueEntityId(requestResponsibleId),
    )

    if (error) return left(error)

    if (!data) return left(new InternalServerError())

    await this.ordersRepository.update(order)
    await this.orderUpdatesRepository.create(data)

    return right(null)
  }
}
