import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Update, UpdateObjectTypes } from './abstract/update'
import { Order } from './order'

export interface UpdateOrderProps<ObjectInstance> {
  objectId: UniqueEntityId
  updatedBy: UniqueEntityId
  date: Date
  changes: {
    before: ObjectInstance
    after: ObjectInstance
  }
  objectType: UpdateObjectTypes
}

export type UpdateOrderCreateProps = Optional<
  UpdateOrderProps<Order>,
  'date' | 'objectType'
>

export class UpdateOrder extends Update<Order, UpdateOrderProps<Order>> {
  static create(props: UpdateOrderCreateProps, id?: UniqueEntityId) {
    const updateOrder = new UpdateOrder(
      {
        ...props,
        date: props.date ?? new Date(),
        objectType: 'order',
      },
      id,
    )

    return updateOrder
  }
}
