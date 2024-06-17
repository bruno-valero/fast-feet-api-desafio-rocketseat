import UniqueEntityId from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationCreateProps,
} from '@/domain/generic/notification/enterprise/entities/notification'

import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export default function MakeNotification(
  override: Partial<NotificationCreateProps> = {},
  id?: string,
) {
  const notification = Notification.create(
    {
      recipientId: randomUUID(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return notification
}
