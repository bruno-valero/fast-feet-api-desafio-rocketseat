import Entity from '@/core/entities/entity'
import { Cpf } from '../value-objects/cpf'
import { Coordinates } from '../value-objects/coordinates'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import z from 'zod'

export const userRoleSchema = z.enum(['recipient', 'adm', 'courier'])
export type UserRoles = z.infer<typeof userRoleSchema>

export interface UserProps {
  name: string
  cpf: Cpf
  password: string
  role: UserRoles
  coordinates: Coordinates | null
  createdAt: Date
  updatedAt: Date | null
}

export type UserUpdateDadaProps = { name: string; cpf: string }

export abstract class User<
  props extends UserProps,
  UpdateReturn,
> extends Entity<props> {
  protected touch() {
    this.props.updatedAt = new Date()
  }

  protected abstract update(
    callback: () => void,
    updatedBy: UniqueEntityId,
  ): UpdateReturn

  changeData({ cpf, name }: UserUpdateDadaProps, updatedBy: UniqueEntityId) {
    const update = this.update(() => {
      this.props.cpf = new Cpf(cpf)
      this.props.name = name
    }, updatedBy)

    return { data: update }
  }

  changePassword(newPass: string, updatedBy: UniqueEntityId) {
    const update = this.update(() => {
      this.props.password = newPass
    }, updatedBy)

    return { data: update }
  }

  hashPassword(hash: string) {
    this.props.password = hash
  }

  toJson(spacing?: number) {
    const object = {
      coordinates: this.coordinates?.raw ?? null,
      cpf: this.cpf.format,
      name: this.name,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }

    return JSON.stringify(object, null, spacing)
  }

  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get coordinates() {
    return this.props.coordinates
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
