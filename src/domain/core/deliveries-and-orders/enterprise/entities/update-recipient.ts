import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Update, UpdateObjectTypes } from './abstract/update'
import { Recipient } from './recipient'

export interface UpdateRecipientProps<ObjectInstance> {
  objectId: UniqueEntityId
  updatedBy: UniqueEntityId
  date: Date
  changes: {
    before: ObjectInstance
    after: ObjectInstance
  }
  objectType: UpdateObjectTypes
}

export type UpdateRecipientCreateProps = Optional<
  UpdateRecipientProps<Recipient>,
  'date' | 'objectType'
>

export class UpdateRecipient extends Update<
  Recipient,
  UpdateRecipientProps<Recipient>
> {
  static create(props: UpdateRecipientCreateProps, id?: UniqueEntityId) {
    const updateRecipient = new UpdateRecipient(
      {
        ...props,
        date: props.date ?? new Date(),
        objectType: 'recipient',
      },
      id,
    )

    return updateRecipient
  }
}
