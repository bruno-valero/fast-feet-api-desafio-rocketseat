import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotificationsRepository } from '@/domain/generic/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/generic/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async getById(notificationId: string): Promise<Notification | null> {
    const notification =
      this.items.filter((item) => item.id.value === notificationId)[0] ?? null

    return notification
  }

  async update(notification: Notification): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === notification.id.value,
    )

    if (index < 0) throw new ResourceNotFoundError()

    this.items[index] = notification
  }
}
