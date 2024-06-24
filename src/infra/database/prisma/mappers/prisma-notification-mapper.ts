import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/generic/notification/enterprise/entities/notification'
import { PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(notification: PrismaNotification): Notification {
    const newNotification = Notification.create(
      {
        content: notification.content,
        recipientId: notification.recipientId,
        title: notification.title,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      },
      new UniqueEntityId(notification.id),
    )

    return newNotification
  }

  static domainToPrisma(notification: Notification): PrismaNotification {
    const newNotification = <PrismaNotification>{
      id: notification.id.value,
      content: notification.content,
      title: notification.title,
      recipientId: notification.recipientId.value,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }

    return newNotification
  }
}
