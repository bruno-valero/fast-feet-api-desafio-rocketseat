import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Adm } from '@/domain/core/deliveries-and-orders/enterprise/entities/adm'
import {
  Coordinates,
  CoordinatesProps,
} from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { PrismaUser } from '@prisma/client'

export class PrismaAdmMapper {
  static toDomain(prismaAdm: PrismaUser): Adm {
    if (prismaAdm.role !== 'adm')
      throw new EntityTypeError(
        `Adm.role must be equal "adm", but "${prismaAdm.role}" was passed`,
      )

    const coordinates = prismaAdm.coordinates
      ? new Coordinates(
          JSON.parse(prismaAdm.coordinates as string) as CoordinatesProps,
        )
      : null

    const update = Adm.create(
      {
        cpf: new Cpf(prismaAdm.cpf),
        name: prismaAdm.name,
        password: prismaAdm.password,
        role: prismaAdm.role,
        coordinates,
        createdAt: prismaAdm.createdAt,
        updatedAt: prismaAdm.updatedAt,
      },
      new UniqueEntityId(prismaAdm.id),
    )

    return update
  }

  static domainToPrisma(adm: Adm): PrismaUser {
    const coordinates = adm.coordinates?.raw
      ? JSON.stringify(adm.coordinates.raw)
      : null

    const prismaAdm: PrismaUser = {
      id: adm.id.value,
      cpf: adm.cpf.raw,
      name: adm.name,
      password: adm.password,
      role: adm.role,
      coordinates,
      createdAt: adm.createdAt,
      updatedAt: adm.updatedAt,
    }

    return prismaAdm
  }
}
