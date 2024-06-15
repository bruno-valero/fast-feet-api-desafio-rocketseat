import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Update, UpdateObjectTypes } from './abstract/update'
import { Adm } from './adm'

export interface UpdateAdmProps<ObjectInstance> {
  objectId: UniqueEntityId
  updatedBy: UniqueEntityId
  date: Date
  changes: {
    before: ObjectInstance
    after: ObjectInstance
  }
  objectType: UpdateObjectTypes
}

export type UpdateAdmCreateProps = Optional<
  UpdateAdmProps<Adm>,
  'date' | 'objectType'
>

export class UpdateAdm extends Update<Adm, UpdateAdmProps<Adm>> {
  static create(props: UpdateAdmCreateProps, id?: UniqueEntityId) {
    const updateAdm = new UpdateAdm(
      {
        ...props,
        date: props.date ?? new Date(),
        objectType: 'adm',
      },
      id,
    )

    return updateAdm
  }
}
