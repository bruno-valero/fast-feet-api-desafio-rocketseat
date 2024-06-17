import UniqueEntityId from '@/core/entities/unique-entity-id'

import SendNotificationUseCase from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/notification-in-memory-repositories/in-memory-notification-repository'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

beforeAll(() => {
  notificationsRepository = new InMemoryNotificationsRepository()
  sut = new SendNotificationUseCase(notificationsRepository)
})

afterAll(() => {})

describe('send notification Use Case', async () => {
  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'teste',
      recipientId: '123',
      title: 'oio',
    })

    expect(result.isRight()).toEqual(true)
    expect(notificationsRepository.items[0].recipientId).toEqual(
      new UniqueEntityId('123'),
    )
  })
})
