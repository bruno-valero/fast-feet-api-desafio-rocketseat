import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Update, UpdateObjectTypes } from './abstract/update'
import { Courier } from './courier'

export interface UpdateCourierProps<ObjectInstance> {
  objectId: UniqueEntityId
  updatedBy: UniqueEntityId
  date: Date
  changes: {
    before: ObjectInstance
    after: ObjectInstance
  }
  objectType: UpdateObjectTypes
}

export type UpdateCourierCreateProps = Optional<
  UpdateCourierProps<Courier>,
  'date' | 'objectType'
>

export class UpdateCourier extends Update<
  Courier,
  UpdateCourierProps<Courier>
> {
  static create(props: UpdateCourierCreateProps, id?: UniqueEntityId) {
    const updateCourier = new UpdateCourier(
      {
        ...props,
        date: props.date ?? new Date(),
        objectType: 'courier',
      },
      id,
    )

    return updateCourier
  }
}
