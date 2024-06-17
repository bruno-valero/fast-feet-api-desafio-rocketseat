import { Injectable } from '@nestjs/common'
import { OrderAttachment } from '../../../enterprise/entities/order-attachment'

@Injectable()
export abstract class OrderAttachmentsRepository {
  abstract create(update: OrderAttachment): Promise<void>
  abstract findByOrderId(orderId: string): Promise<OrderAttachment | null>
  abstract findById(id: string): Promise<OrderAttachment | null>
  abstract updateById(orderAttachment: OrderAttachment): Promise<void>

  abstract deleteByOrderId(orderId: string): Promise<void>
}
