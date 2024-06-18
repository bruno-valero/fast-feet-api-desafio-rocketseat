import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { Coordinates } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaOrderMapper } from '../../mappers/prisma-order-mapper'

@Injectable()
export class PrismaOrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    await this.prisma.prismaUser.create({
      data: PrismaOrderMapper.domainToPrisma(order),
    })
  }

  async update(order: Order): Promise<void> {
    await this.prisma.prismaUser.update({
      where: {
        id: order.id.value,
      },
      data: PrismaOrderMapper.domainToPrisma(order),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prismaUser.delete({
      where: {
        id,
      },
    })
  }

  async findById(id: string): Promise<Order | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    const mappedData = PrismaOrderMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<Order[]>
  async findManyNearBy(coordinates: Coordinates): Promise<Order[]>
  async findManyByOrderId(orderId: string): Promise<Order[]>
  async findManyByRecipientId(recipientId: string): Promise<Order[]>
}
