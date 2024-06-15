import { Optional } from '@/core/types/optional'
import { User, UserRoles } from './abstract/user'
import { Coordinates } from './value-objects/coordinates'
import { Cpf } from './value-objects/cpf'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UpdateAdm } from './update-adm'

export interface AdmProps {
  name: string
  cpf: Cpf
  password: string
  role: UserRoles
  coordinates: Coordinates | null
  createdAt: Date
  updatedAt: Date | null
}

export type AdmCreateProps = Optional<
  AdmProps,
  'role' | 'createdAt' | 'updatedAt' | 'coordinates'
>

export type UpdateAdmReturn<errors> = { data?: UpdateAdm; error?: errors }

export class Adm extends User<AdmProps, UpdateAdm> {
  static create(props: AdmCreateProps, id?: UniqueEntityId) {
    return new Adm(
      {
        ...props,
        role: 'adm',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: null,
        coordinates: props.coordinates ?? null,
      },
      id,
    )
  }

  protected update(callback: () => void, updatedBy: UniqueEntityId) {
    const before = new Adm(this.props, this.id)

    callback()
    this.touch()

    const update = UpdateAdm.create({
      objectId: this.id,
      updatedBy,
      changes: {
        before,
        after: this,
      },
    })

    return update
  }
}
