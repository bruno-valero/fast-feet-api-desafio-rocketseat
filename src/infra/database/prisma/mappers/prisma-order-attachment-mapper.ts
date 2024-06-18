import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { OrderAttachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/order-attachment'
import { PrismaAttachments } from '@prisma/client'

export class PrismaOrderAttachmentMapper {
  static toDomain(prismaOrderAttachment: PrismaAttachments): OrderAttachment {
    if (!prismaOrderAttachment.orderId)
      throw new EntityTypeError(
        `OrderAttachment.orderId must be a string, but a nullish value was passed`,
      )

    const update = OrderAttachment.create(
      {
        attachmentId: new UniqueEntityId(prismaOrderAttachment.id),
        orderId: new UniqueEntityId(prismaOrderAttachment.orderId),
      },
      new UniqueEntityId(prismaOrderAttachment.id),
    )

    return update
  }

  // static domainToPrisma(OrderAttachment: OrderAttachment): PrismaAttachments {
  //   const prismaOrderAttachment: PrismaAttachments = {
  //     id: OrderAttachment.attachmentId.value,
  //     orderId: OrderAttachment.orderId.value,

  //   }

  //   return prismaOrderAttachment
  // }
}
