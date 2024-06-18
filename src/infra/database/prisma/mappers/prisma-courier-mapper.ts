import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import {
  Coordinates,
  CoordinatesProps,
} from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { PrismaUser } from '@prisma/client'

export class PrismaCourierMapper {
  static toDomain(prismaCourier: PrismaUser): Courier {
    if (prismaCourier.role !== 'courier')
      throw new EntityTypeError(
        `Courier.role must be equal "courier", but "${prismaCourier.role}" was passed`,
      )

    const coordinates = prismaCourier.coordinates
      ? new Coordinates(
          JSON.parse(prismaCourier.coordinates as string) as CoordinatesProps,
        )
      : null

    const update = Courier.create(
      {
        cpf: new Cpf(prismaCourier.cpf),
        name: prismaCourier.name,
        password: prismaCourier.password,
        role: prismaCourier.role,
        coordinates,
        createdAt: prismaCourier.createdAt,
        updatedAt: prismaCourier.updatedAt,
      },
      new UniqueEntityId(prismaCourier.id),
    )

    return update
  }

  static domainToPrisma(courier: Courier): PrismaUser {
    const coordinates = courier.coordinates?.raw
      ? JSON.stringify(courier.coordinates.raw)
      : null

    const prismaCourier: PrismaUser = {
      id: courier.id.value,
      cpf: courier.cpf.raw,
      name: courier.name,
      password: courier.password,
      role: courier.role,
      coordinates,
      createdAt: courier.createdAt,
      updatedAt: courier.updatedAt,
    }

    return prismaCourier
  }
}
