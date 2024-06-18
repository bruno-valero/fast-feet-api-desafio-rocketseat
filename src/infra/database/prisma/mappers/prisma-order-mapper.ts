import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { OrderAttachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/order-attachment'
import { Address } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/address'
import { PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(prismaOrder: PrismaOrder): Order {
    const address = new Address(JSON.parse(prismaOrder.address))
    const courierId = prismaOrder.courierId
      ? new UniqueEntityId(prismaOrder.courierId)
      : null

    const attachData = prismaOrder.deliveredPhoto
      ? JSON.parse(prismaOrder.deliveredPhoto)
      : null

    const attachment = attachData
      ? Attachment.create(attachData, new UniqueEntityId(attachData.id))
      : null

    if (attachment && !attachment.orderId)
      throw new EntityTypeError(
        `when "PrismaOrder.deliveredPhoto" is not null, "PrismaOrder.deliveredPhoto.orderId" is obrigatory`,
      )

    const deliveredPhoto = attachment
      ? OrderAttachment.create({
          attachmentId: attachment.id,
          orderId: attachment.orderId!,
        })
      : null

    const update = Order.create(
      {
        address,
        courierId,
        recipientId: new UniqueEntityId(prismaOrder.recipientId),
        awaitingPickup: prismaOrder.awaitingPickup,
        collected: prismaOrder.collected,
        delivered: prismaOrder.delivered,
        deliveredPhoto,
        returned: prismaOrder.returned,
        returnCause: prismaOrder.returnCause,
        createdAt: prismaOrder.createdAt,
        updatedAt: prismaOrder.updatedAt,
      },
      new UniqueEntityId(prismaOrder.id),
    )

    return update
  }

  static domainToPrisma(order: Order): PrismaOrder {
    const address = JSON.stringify(order.address.raw)
    const deliveredPhoto = order.deliveredPhoto?.raw
      ? JSON.stringify(order.deliveredPhoto.raw)
      : null

    const prismaOrder: PrismaOrder = {
      id: order.id.value,
      address,
      courierId: order.courierId?.value ?? null,
      recipientId: order.recipientId.value,
      awaitingPickup: order.awaitingPickup,
      collected: order.collected,
      delivered: order.delivered,
      deliveredPhoto,
      returned: order.returned,
      returnCause: order.returnCause,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return prismaOrder
  }
}
