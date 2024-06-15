import { Optional } from '@/core/types/optional'
import { User, UserRoles } from './abstract/user'
import { Coordinates } from './value-objects/coordinates'
import { Cpf } from './value-objects/cpf'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UpdateCourier } from './update-courier'

export interface CourierProps {
  name: string
  cpf: Cpf
  password: string
  role: UserRoles
  coordinates: Coordinates | null
  createdAt: Date
  updatedAt: Date | null
}

export type CourierCreateProps = Optional<
  CourierProps,
  'role' | 'createdAt' | 'updatedAt' | 'coordinates'
>

export type UpdateCourierReturn<errors> = {
  data?: UpdateCourier
  error?: errors
}

export class Courier extends User<CourierProps, UpdateCourier> {
  static create(props: CourierCreateProps, id?: UniqueEntityId) {
    return new Courier(
      {
        ...props,
        role: 'courier',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: null,
        coordinates: props.coordinates ?? null,
      },
      id,
    )
  }

  protected update(callback: () => void, updatedBy: UniqueEntityId) {
    const before = new Courier(this.props, this.id)

    callback()
    this.touch()

    const updateOrder = UpdateCourier.create({
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
