import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OrderPresenter {
  constructor(private prisma: PrismaService) {}
  async present(order: Order) {
    if (!order.courierId) {
      throw new Error('courier id cannot be null')
    }

    const courier = await this.prisma.prismaUser.findUnique({
      where: {
        id: order.courierId.value,
      },
    })

    if (!courier) {
      throw new ResourceNotFoundError()
    }

    const recipient = await this.prisma.prismaUser.findUnique({
      where: {
        id: order.recipientId.value,
      },
    })

    if (!recipient) {
      throw new ResourceNotFoundError()
    }

    return {
      id: order.id,
      address: order.address.raw,
      status: {
        awaitingPickup: order.awaitingPickup,
        collected: order.collected,
        delivered: order.delivered,
        returned: order.returned,
      },
      courier: {
        name: courier.name,
        id: courier.id,
      },
      recipient: {
        name: recipient.name,
        id: recipient.id,
      },
    }
  }
}
