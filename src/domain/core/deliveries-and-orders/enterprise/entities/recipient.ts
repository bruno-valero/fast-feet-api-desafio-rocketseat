import { Optional } from '@/core/types/optional'
import { User, UserRoles } from './abstract/user'
import { Coordinates } from './value-objects/coordinates'
import { Cpf } from './value-objects/cpf'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UpdateRecipient } from './update-recipient'

export interface RecipientProps {
  name: string
  cpf: Cpf
  password: string
  role: UserRoles
  coordinates: Coordinates | null
  createdAt: Date
  updatedAt: Date | null
}

export type RecipientCreateProps = Optional<
  RecipientProps,
  'role' | 'createdAt' | 'updatedAt' | 'coordinates'
>

export type UpdateRecipientReturn<errors> = {
  data?: UpdateRecipient
  error?: errors
}

export class Recipient extends User<RecipientProps, UpdateRecipient> {
  static create(props: RecipientCreateProps, id?: UniqueEntityId) {
    return new Recipient(
      {
        ...props,
        role: 'recipient',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: null,
        coordinates: props.coordinates ?? null,
      },
      id,
    )
  }

  protected update(callback: () => void, updatedBy: UniqueEntityId) {
    const before = new Recipient(this.props, this.id)

    callback()
    this.touch()

    const updateOrder = UpdateRecipient.create({
      objectId: this.id,
      updatedBy,
      changes: {
        before,
        after: this,
      },
    })

    return updateOrder
  }
}
