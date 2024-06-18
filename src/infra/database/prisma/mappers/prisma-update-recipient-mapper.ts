import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import { UpdateRecipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-recipient'
import { PrismaUpdates } from '@prisma/client'

export class PrismaUpdateRecipientMapper {
  static toDomain(prismaUpdate: PrismaUpdates): UpdateRecipient {
    if (prismaUpdate.objectType !== 'recipient')
      throw new EntityTypeError(
        `"UpdateRecipient.objectType" needs to be "recipient", but "${prismaUpdate.objectType}" was received`,
      )

    const changes: UpdateRecipient['changes'] = prismaUpdate.changes
      ? JSON.parse(prismaUpdate.changes as string)
      : null

    const afterIsRecipientObject = changes.after instanceof Recipient
    const beforeIsRecipientObject = changes.before instanceof Recipient

    if (!afterIsRecipientObject || !beforeIsRecipientObject)
      throw new EntityTypeError(
        `"UpdateRecipient.changes.after" and "UpdateRecipient.changes.before" needs to be an instance of "Recipient".`,
      )

    const update = UpdateRecipient.create(
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

  static domainToPrisma(update: UpdateRecipient): PrismaUpdates {
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
