import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import { UpdateCourier } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-courier'
import { PrismaUpdates } from '@prisma/client'

export class PrismaUpdateCourierMapper {
  static toDomain(prismaUpdate: PrismaUpdates): UpdateCourier {
    if (prismaUpdate.objectType !== 'courier')
      throw new EntityTypeError(
        `"UpdateCourier.objectType" needs to be "courier", but "${prismaUpdate.objectType}" was received`,
      )

    const changes: UpdateCourier['changes'] = prismaUpdate.changes
      ? JSON.parse(prismaUpdate.changes as string)
      : null

    const afterIsCourierObject = changes.after instanceof Courier
    const beforeIsCourierObject = changes.before instanceof Courier

    if (!afterIsCourierObject || !beforeIsCourierObject)
      throw new EntityTypeError(
        `"UpdateCourier.changes.after" and "UpdateCourier.changes.before" needs to be an instance of "Courier".`,
      )

    const update = UpdateCourier.create(
      {
        changes,
        objectId: new UniqueEntityId(prismaUpdate.objectId),
        updatedBy: new UniqueEntityId(prismaUpdate.updatedBy),
        date: new Date(prismaUpdate.date),
        objectType: prismaUpdate.objectType,
      },
      new UniqueEntityId(prismaUpdate.id),
    )

    return update
  }

  static domainToPrisma(update: UpdateCourier): PrismaUpdates {
    const changes = JSON.stringify(update.changes)

    const prismaUpdate: PrismaUpdates = {
      changes,
      date: update.date,
      id: update.id.value,
      objectId: update.objectId.value,
      objectType: update.objectType,
      updatedBy: update.updatedBy.value,
    }

    return prismaUpdate
  }
}
