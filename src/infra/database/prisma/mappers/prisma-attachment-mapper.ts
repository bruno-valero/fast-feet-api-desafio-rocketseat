import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'
import { PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(prismaAttachment: PrismaAttachment): Attachment {
    const orderId = prismaAttachment.orderId
      ? new UniqueEntityId(prismaAttachment.orderId)
      : null

    const update = Attachment.create(
      {
        title: prismaAttachment.title,
        url: prismaAttachment.url,
        orderId,
      },
      new UniqueEntityId(prismaAttachment.id),
    )

    return update
  }

  static domainToPrisma(attachment: Attachment): PrismaAttachment {
    const prismaAttachment: PrismaAttachment = {
      id: attachment.id.value,
      orderId: attachment.id.value,
      title: attachment.title,
      url: attachment.url,
    }

    return prismaAttachment
  }
}
