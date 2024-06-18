import { UpdateRecipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-recipient'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUpdateRecipientMapper } from '../../mappers/prisma-update-recipient-mapper'

@Injectable()
export class PrismaRecipientUpdatesRepository {
  constructor(private prisma: PrismaService) {}

  async create(update: UpdateRecipient): Promise<void> {
    await this.prisma.prismaUpdates.create({
      data: PrismaUpdateRecipientMapper.domainToPrisma(update),
    })
  }

  async update(update: UpdateRecipient): Promise<void> {
    await this.prisma.prismaUpdates.update({
      where: {
        id: update.id.value,
        objectType: 'recipient',
      },
      data: PrismaUpdateRecipientMapper.domainToPrisma(update),
    })
  }

  async findById(id: string): Promise<UpdateRecipient | null> {
    const data = await this.prisma.prismaUpdates.findUnique({
      where: {
        id,
        objectType: 'recipient',
      },
    })

    if (!data) return null

    const mappedData = PrismaUpdateRecipientMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<UpdateRecipient[]> {
    const data = await this.prisma.prismaUpdates.findMany({
      where: {
        objectType: 'recipient',
      },
    })

    const mappedData = data.map(PrismaUpdateRecipientMapper.toDomain)

    return mappedData
  }
}
