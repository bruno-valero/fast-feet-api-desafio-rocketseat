import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import {
  Coordinates,
  CoordinatesProps,
} from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { PrismaUser } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(prismaRecipient: PrismaUser): Recipient {
    if (prismaRecipient.role !== 'recipient')
      throw new EntityTypeError(
        `Recipient.role must be equal "recipient", but "${prismaRecipient.role}" was passed`,
      )

    const coordinates = prismaRecipient.coordinates
      ? new Coordinates(
          JSON.parse(prismaRecipient.coordinates as string) as CoordinatesProps,
        )
      : null

    const update = Recipient.create(
      {
        cpf: new Cpf(prismaRecipient.cpf),
        name: prismaRecipient.name,
        password: prismaRecipient.password,
        role: prismaRecipient.role,
        coordinates,
        createdAt: prismaRecipient.createdAt,
        updatedAt: prismaRecipient.updatedAt,
      },
      new UniqueEntityId(prismaRecipient.id),
    )

    return update
  }

  static domainToPrisma(recipient: Recipient): PrismaUser {
    const coordinates = recipient.coordinates?.raw
      ? JSON.stringify(recipient.coordinates.raw)
      : null

    const prismaRecipient: PrismaUser = {
      id: recipient.id.value,
      cpf: recipient.cpf.raw,
      name: recipient.name,
      password: recipient.password,
      role: recipient.role,
      coordinates,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }

    return prismaRecipient
  }
}
