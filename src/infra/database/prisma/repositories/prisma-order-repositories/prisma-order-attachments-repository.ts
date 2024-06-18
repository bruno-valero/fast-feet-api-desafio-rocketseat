import { OrderAttachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/order-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaOrderAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(update: OrderAttachment): Promise<void>
  async findByOrderId(orderId: string): Promise<OrderAttachment | null>
  async findById(id: string): Promise<OrderAttachment | null>
  async updateById(orderAttachment: OrderAttachment): Promise<void>

  async deleteByOrderId(orderId: string): Promise<void>
}
