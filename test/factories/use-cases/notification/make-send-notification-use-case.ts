import { NotificationsRepository } from '@/domain/generic/notification/application/repositories/notifications-repository'
import SendNotificationUseCase from '@/domain/generic/notification/application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/notification-in-memory-repositories/in-memory-notification-repository'

export function makeSendNotificationUseCase(props?: {
  notificationsRepositoryAlt?: NotificationsRepository
}) {
  const notificationsRepository =
    props?.notificationsRepositoryAlt ?? new InMemoryNotificationsRepository()
  const useCase = new SendNotificationUseCase(notificationsRepository)

  return {
    useCase,
    dependencies: {
      notificationsRepository,
    },
  }
}
