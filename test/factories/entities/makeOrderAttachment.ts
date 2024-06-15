import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrderAttachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/order-attachment'

export function makeOrderAttachment(
  override?: Partial<OrderAttachment>,
  id?: UniqueEntityId,
) {
  const result = OrderAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      orderId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return result
}
