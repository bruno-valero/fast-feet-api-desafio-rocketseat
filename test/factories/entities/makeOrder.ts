import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { makeAddress } from './value-objects/makeAddress'

export function makeOrder(override?: Partial<Order>, id?: UniqueEntityId) {
  const result = Order.create(
    {
      address: makeAddress(override?.address),
      courierId: new UniqueEntityId(),
      recipientId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  console.log('result.recipientId', result.recipientId)

  return result
}
