import { DomainEvents } from '@/core/events/domain-events'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { Coordinates } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { Injectable } from '@nestjs/common'
import { PrismaOrder } from '@prisma/client'
import { PrismaOrderMapper } from '../../mappers/prisma-order-mapper'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async create(order: Order): Promise<void> {
    await this.prisma.prismaOrder.create({
      data: PrismaOrderMapper.domainToPrisma(order),
    })

    await this.cache.delete(`orders:${order.recipientId.value}`)
    await this.cache.delete(`orders:${order.courierId?.value}`)
    await this.cache.delete('orders')
  }

  async update(order: Order): Promise<void> {
    await this.prisma.prismaOrder.update({
      where: {
        id: order.id.value,
      },
      data: PrismaOrderMapper.domainToPrisma(order),
    })

    DomainEvents.dispatchEventsForAggregate(order.id)

    await this.cache.delete(`orders:${order.recipientId.value}`)
    await this.cache.delete(`orders:${order.courierId?.value}`)
    await this.cache.delete('orders')
  }

  async delete(id: string): Promise<void> {
    const data = await this.prisma.prismaOrder.findUnique({
      where: {
        id,
      },
    })

    await this.prisma.prismaOrder.delete({
      where: {
        id,
      },
    })

    await this.cache.delete(`orders:${data?.recipientId}`)
    await this.cache.delete(`orders:${data?.courierId}`)
    await this.cache.delete('orders')
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
    const cacheHit = await this.cache.get('orders')

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit) as PrismaOrder[]
      const orders = cachedData.map((item) => PrismaOrderMapper.toDomain(item))

      return orders
    }

    const data = await this.prisma.prismaOrder.findMany()

    this.cache.set('orders', JSON.stringify(data))

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
    const transformToCamelCase = (text: string) => {
      let result = text.split('').join('')
      const partTwo = text.split('_')[1]
      if (partTwo) {
        const Capitalized = partTwo[0].toUpperCase() + partTwo.slice(1)
        result = text.split('_')[0]
        result = result + Capitalized
      }

      return result
    }

    const camelCaseData = data.map((item) => {
      const mappedItem = Object.entries(item).reduce(
        (acc: PrismaOrder, entry) => {
          acc[transformToCamelCase(entry[0])] = entry[1]

          return acc
        },
        {} as PrismaOrder,
      )
      return mappedItem
    })

    const mappedData = camelCaseData.map(PrismaOrderMapper.toDomain)

    return mappedData
  }

  async findManyByCourierId(courierId: string): Promise<Order[]> {
    const cacheHit = await this.cache.get(`orders:${courierId}`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit) as PrismaOrder[]
      const orders = cachedData.map((item) => PrismaOrderMapper.toDomain(item))

      return orders
    }

    const data = await this.prisma.prismaOrder.findMany({
      where: {
        courierId,
      },
    })

    this.cache.set(`orders:${courierId}`, JSON.stringify(data))

    const mappedData = data.map(PrismaOrderMapper.toDomain)

    return mappedData
  }

  async findManyByRecipientId(recipientId: string): Promise<Order[]> {
    const cacheHit = await this.cache.get(`orders:${recipientId}`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit) as PrismaOrder[]
      const orders = cachedData.map((item) => PrismaOrderMapper.toDomain(item))

      return orders
    }

    const data = await this.prisma.prismaOrder.findMany({
      where: {
        recipientId,
      },
    })

    this.cache.set(`orders:${recipientId}`, JSON.stringify(data))

    const mappedData = data.map(PrismaOrderMapper.toDomain)

    return mappedData
  }
}
