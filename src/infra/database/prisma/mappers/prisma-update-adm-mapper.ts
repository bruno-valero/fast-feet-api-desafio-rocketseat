import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Adm } from '@/domain/core/deliveries-and-orders/enterprise/entities/adm'
import { UpdateAdm } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-adm'
import { PrismaUpdates } from '@prisma/client'

export class PrismaUpdateAdmMapper {
  static toDomain(prismaUpdate: PrismaUpdates): UpdateAdm {
    if (prismaUpdate.objectType !== 'adm')
      throw new EntityTypeError(
        `"UpdateAdm.objectType" needs to be "adm", but "${prismaUpdate.objectType}" was received`,
      )

    const changes: UpdateAdm['changes'] = prismaUpdate.changes
      ? JSON.parse(prismaUpdate.changes as string)
      : null

    const afterIsAdmObject = changes.after instanceof Adm
    const beforeIsAdmObject = changes.before instanceof Adm

    if (!afterIsAdmObject || !beforeIsAdmObject)
      throw new EntityTypeError(
        `"UpdateAdm.changes.after" and "UpdateAdm.changes.before" needs to be an instance of "Adm".`,
      )

    const update = UpdateAdm.create(
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

  static domainToPrisma(update: UpdateAdm): PrismaUpdates {
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
