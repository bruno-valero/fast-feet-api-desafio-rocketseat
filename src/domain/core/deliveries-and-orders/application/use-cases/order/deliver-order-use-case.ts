import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrderUpdatesRepository } from '../../repositories/order-repositories/order-updates-repository'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { OrderAwaitingPickupError } from '@/core/errors/errors/order-errors/order-awaiting-for-pickup-error'
import { OrderIsClosedError } from '@/core/errors/errors/order-errors/order-is-closed-error'
import { InternalServerError } from '@/core/errors/errors/internal-server-error'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { AttachmentNotFoundError } from '@/core/errors/errors/attachment-errors/attachment-not-found-error'
import { Injectable } from '@nestjs/common'
import { AttachmentsRepository } from '../../repositories/attachments-repository'

export interface DeliverOrderUseCaseRequest {
  orderId: string
  requestResponsibleId: string
  attachmentId: string
}

export type DeliverOrderUseCaseResponse = Either<
  | ResourceNotFoundError
  | UnauthorizedError
  | AttachmentNotFoundError
  | OrderAwaitingPickupError
  | OrderIsClosedError
  | InternalServerError,
  null
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private couriersRepository: CouriersRepository,
    private orderUpdatesRepository: OrderUpdatesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    orderId,
    requestResponsibleId,
    attachmentId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const responsible =
      await this.couriersRepository.findById(requestResponsibleId)
    if (!responsible) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'deliver_order',
      responsible.role,
    )
    if (!hasPermission) return left(new UnauthorizedError())

    const order = await this.ordersRepository.findById(orderId)
    if (!order) return left(new ResourceNotFoundError())

    const { data, error } = order.actions.courier.courierDeliver(
      new UniqueEntityId(requestResponsibleId),
    )

    if (error) return left(error)

    if (!data) return left(new InternalServerError())

    const attachment = await this.attachmentsRepository.findById(attachmentId)
    if (!attachment) return left(new AttachmentNotFoundError(attachmentId))

    await this.ordersRepository.update(order)
    await this.orderUpdatesRepository.create(data)
    attachment.setOrderId(order.id.value)
    await this.attachmentsRepository.updateById(attachment)

    return right(null)
  }
}
