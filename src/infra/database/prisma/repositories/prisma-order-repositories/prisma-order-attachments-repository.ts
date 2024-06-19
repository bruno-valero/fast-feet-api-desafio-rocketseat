import { OrderAttachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/order-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { OrderAttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-attachments-repository'
import { PrismaAttachmentMapper } from '../../mappers/prisma-attachment-mapper'
import { PrismaOrderAttachmentMapper } from '../../mappers/prisma-order-attachment-mapper'

@Injectable()
export class PrismaOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(update: OrderAttachment): Promise<void> {
    await this.prisma.prismaAttachment.update({
      where: {
        id: update.attachmentId.value,
      },
      data: {
        orderId: update.orderId.value,
      },
    })
  }

  async findByOrderId(orderId: string): Promise<OrderAttachment | null> {
    const data = await this.prisma.prismaAttachment.findUnique({
      where: {
        orderId,
      },
    })

    if (!data) return null

    const dataMapped = PrismaOrderAttachmentMapper.toDomain(data)

    return dataMapped
  }

  async findById(id: string): Promise<OrderAttachment | null> {
    const data = await this.prisma.prismaAttachment.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    const dataMapped = PrismaOrderAttachmentMapper.toDomain(data)

    return dataMapped
  }

  async updateById(orderAttachment: OrderAttachment): Promise<void> {
    const attach = await this.prisma.prismaAttachment.findUnique({
      where: {
        id: orderAttachment.attachmentId.value,
      },
    })

    if (!attach) return

    const attachment = PrismaAttachmentMapper.toDomain(attach)

    await this.prisma.prismaAttachment.update({
      where: {
        id: orderAttachment.attachmentId.value,
      },
      data: PrismaAttachmentMapper.domainToPrisma(attachment),
    })
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await this.prisma.prismaAttachment.delete({
      where: {
        orderId,
      },
    })
  }
}
