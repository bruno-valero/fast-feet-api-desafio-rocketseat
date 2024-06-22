import UniqueEntityId from '@/core/entities/unique-entity-id'
import { EntityTypeError } from '@/core/errors/errors/entity-type-error'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'
import { UpdateOrder } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-order'
import { PrismaUpdates } from '@prisma/client'

export class PrismaUpdateOrderMapper {
  static toDomain(prismaUpdate: PrismaUpdates): UpdateOrder {
    if (prismaUpdate.objectType !== 'order')
      throw new EntityTypeError(
        `"UpdateOrder.objectType" needs to be "order", but "${prismaUpdate.objectType}" was received`,
      )

    const changes: UpdateOrder['changes'] = prismaUpdate.changes
      ? JSON.parse(prismaUpdate.changes as string)
      : null

    const afterIsOrderObject = changes.after instanceof Order
    const beforeIsOrderObject = changes.before instanceof Order

    if (!afterIsOrderObject || !beforeIsOrderObject)
      throw new EntityTypeError(
        `"UpdateOrder.changes.after" and "UpdateOrder.changes.before" needs to be an instance of "Order".`,
      )

    const update = UpdateOrder.create(
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

  static domainToPrisma(update: UpdateOrder): PrismaUpdates {
    const changes = JSON.stringify({
      before: update.changes.before.toJson(),
      after: update.changes.after.toJson(),
    })

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
