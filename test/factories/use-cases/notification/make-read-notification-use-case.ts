import { NotificationsRepository } from '@/domain/generic/notification/application/repositories/notifications-repository'
import ReadNotificationUseCase from '@/domain/generic/notification/application/use-cases/read-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/notification-in-memory-repositories/in-memory-notification-repository'

export function makeReadNotificationUseCase(props?: {
  notificationsRepositoryAlt?: NotificationsRepository
}) {
  const notificationsRepository =
    props?.notificationsRepositoryAlt ?? new InMemoryNotificationsRepository()
  const useCase = new ReadNotificationUseCase(notificationsRepository)

  return {
    useCase,
    dependencies: {
      notificationsRepository,
    },
  }
}
