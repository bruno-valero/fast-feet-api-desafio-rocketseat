import MakeNotification from 'test/factories/entities/make-notification'

import ReadNotificationUseCase from './read-notification'

import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Notification } from '../../enterprise/entities/notification'
import { InMemoryNotificationsRepository } from 'test/repositories/notification-in-memory-repositories/in-memory-notification-repository'

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

beforeAll(() => {
  notificationsRepository = new InMemoryNotificationsRepository()
  sut = new ReadNotificationUseCase(notificationsRepository)
})

afterAll(() => {})

describe('read notification Use Case', async () => {
  it('should be able to read a notification', async () => {
    await notificationsRepository.create(
      MakeNotification({ recipientId: '123' }),
    )

    const notification = notificationsRepository.items[0]

    const result = await sut.execute({
      notificationId: notification.id.value,
      recipientId: '123',
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.notification).toBeInstanceOf(Notification)
      expect(result.value.notification.readAt).toEqual(expect.any(Date))

      expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
    }
  })
  it('should not be able to read a notification from another recipient', async () => {
    await notificationsRepository.create(
      MakeNotification({ recipientId: '123' }),
    )

    const notification = notificationsRepository.items[0]

    const result = await sut.execute({
      notificationId: notification.id.value,
      recipientId: 'another recipient',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
