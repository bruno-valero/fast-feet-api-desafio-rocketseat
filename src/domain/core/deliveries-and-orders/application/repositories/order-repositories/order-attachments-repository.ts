import { Injectable } from '@nestjs/common'
import { OrderAttachment } from '../../../enterprise/entities/order-attachment'

@Injectable()
export abstract class OrderAttachmentsRepository {
  abstract create(update: OrderAttachment): Promise<void>
  abstract findByOrderId(orderId: string): Promise<OrderAttachment | null>
  abstract deleteByOrderId(orderId: string): Promise<void>
}
