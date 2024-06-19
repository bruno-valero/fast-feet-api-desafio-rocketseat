import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { AttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/attachments-repository'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    await this.prisma.prismaAttachment.create({
      data: PrismaAttachmentMapper.domainToPrisma(attachment),
    })
  }

  async findById(id: string): Promise<Attachment | null> {
    const data = await this.prisma.prismaAttachment.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    const dataMapped = PrismaAttachmentMapper.toDomain(data)

    return dataMapped
  }

  async updateById(attachment: Attachment): Promise<void> {
    await this.prisma.prismaAttachment.update({
      where: {
        id: attachment.id.value,
      },
      data: PrismaAttachmentMapper.domainToPrisma(attachment),
    })
  }
}
