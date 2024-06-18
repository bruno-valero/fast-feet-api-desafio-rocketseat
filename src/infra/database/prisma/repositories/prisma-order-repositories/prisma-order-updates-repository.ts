import { UpdateOrder } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-order'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUpdateOrderMapper } from '../../mappers/prisma-update-order-mapper'

@Injectable()
export class PrismaOrderUpdatesRepository {
  constructor(private prisma: PrismaService) {}

  async create(update: UpdateOrder): Promise<void> {
    await this.prisma.prismaUpdates.create({
      data: PrismaUpdateOrderMapper.domainToPrisma(update),
    })
  }

  async update(update: UpdateOrder): Promise<void> {
    await this.prisma.prismaUpdates.update({
      where: {
        id: update.id.value,
        objectType: 'order',
      },
      data: PrismaUpdateOrderMapper.domainToPrisma(update),
    })
  }

  async findById(id: string): Promise<UpdateOrder | null> {
    const data = await this.prisma.prismaUpdates.findUnique({
      where: {
        id,
        objectType: 'order',
      },
    })

    if (!data) return null

    const mappedData = PrismaUpdateOrderMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<UpdateOrder[]> {
    const data = await this.prisma.prismaUpdates.findMany({
      where: {
        objectType: 'order',
      },
    })

    const mappedData = data.map(PrismaUpdateOrderMapper.toDomain)

    return mappedData
  }
}
