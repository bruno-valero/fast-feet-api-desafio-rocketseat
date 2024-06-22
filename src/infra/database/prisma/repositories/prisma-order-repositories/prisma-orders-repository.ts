import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { Coordinates } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaOrderMapper } from '../../mappers/prisma-order-mapper'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { PrismaOrder } from '@prisma/client'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    await this.prisma.prismaOrder.create({
      data: PrismaOrderMapper.domainToPrisma(order),
    })
  }

  async update(order: Order): Promise<void> {
    await this.prisma.prismaOrder.update({
      where: {
        id: order.id.value,
      },
      data: PrismaOrderMapper.domainToPrisma(order),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prismaOrder.delete({
      where: {
        id,
      },
    })
  }

  async findById(id: string): Promise<Order | null> {
    const data = await this.prisma.prismaOrder.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    const mappedData = PrismaOrderMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<Order[]> {
    const data = await this.prisma.prismaOrder.findMany()

    const mappedData = data.map(PrismaOrderMapper.toDomain)

    return mappedData
  }

  async findManyNearBy(
    { latitude, longitude }: Coordinates,
    courierId: string,
  ): Promise<Order[]> {
    const data = await this.prisma.$queryRaw<PrismaOrder[]>`
    SELECT * from orders
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    AND courier_id = ${courierId}
    `

    const mappedData = data.map(PrismaOrderMapper.toDomain)

    return mappedData
  }

  async findManyByCourierId(courierId: string): Promise<Order[]> {
    const data = await this.prisma.prismaOrder.findMany({
      where: {
        courierId,
      },
    })

    const mappedData = data.map(PrismaOrderMapper.toDomain)

    return mappedData
  }

  async findManyByRecipientId(recipientId: string): Promise<Order[]> {
    const data = await this.prisma.prismaOrder.findMany({
      where: {
        recipientId,
      },
    })

    const mappedData = data.map(PrismaOrderMapper.toDomain)

    return mappedData
  }
}
