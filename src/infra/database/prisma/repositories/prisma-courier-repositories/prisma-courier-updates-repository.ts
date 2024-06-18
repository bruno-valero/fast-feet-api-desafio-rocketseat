import { UpdateCourier } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-courier'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUpdateCourierMapper } from '../../mappers/prisma-update-courier-mapper'

@Injectable()
export class PrismaCourierUpdatesRepository {
  constructor(private prisma: PrismaService) {}

  async create(update: UpdateCourier): Promise<void> {
    await this.prisma.prismaUpdates.create({
      data: PrismaUpdateCourierMapper.domainToPrisma(update),
    })
  }

  async update(update: UpdateCourier): Promise<void> {
    await this.prisma.prismaUpdates.update({
      where: {
        id: update.id.value,
        objectType: 'courier',
      },
      data: PrismaUpdateCourierMapper.domainToPrisma(update),
    })
  }

  async findById(id: string): Promise<UpdateCourier | null> {
    const data = await this.prisma.prismaUpdates.findUnique({
      where: {
        id,
        objectType: 'courier',
      },
    })

    if (!data) return null

    const mappedData = PrismaUpdateCourierMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<UpdateCourier[]> {
    const data = await this.prisma.prismaUpdates.findMany({
      where: {
        objectType: 'courier',
      },
    })

    const mappedData = data.map(PrismaUpdateCourierMapper.toDomain)

    return mappedData
  }
}
