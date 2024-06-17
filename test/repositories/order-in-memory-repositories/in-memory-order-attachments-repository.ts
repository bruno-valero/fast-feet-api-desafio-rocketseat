import { OrderAttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-attachments-repository'
import { OrderAttachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/order-attachment'

export class InMemoryOrderAttachmentsRepository extends OrderAttachmentsRepository {
  items: OrderAttachment[] = []

  async create(orderattachment: OrderAttachment): Promise<void> {
    this.items.push(orderattachment)
  }

  async findByOrderId(orderId: string): Promise<OrderAttachment | null> {
    return this.items.find((item) => item.orderId.value === orderId) ?? null
  }

  async findById(id: string): Promise<OrderAttachment | null> {
    return this.items.find((item) => item.id.value === id) ?? null
  }

  async updateById(orderAttachment: OrderAttachment): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.orderId.equals(orderAttachment.id),
    )

    if (index >= 0) {
      this.items[index] = orderAttachment
    }
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.orderId.value === orderId)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}
