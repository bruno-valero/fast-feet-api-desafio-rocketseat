import { Either, left, right } from '@/core/either'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface ReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

export type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    notification: Notification
  }
>

@Injectable()
export default class ReadNotificationUseCase {
  constructor(protected notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notificationResp =
      await this.notificationsRepository.getById(notificationId)

    if (!notificationResp) return left(new ResourceNotFoundError())

    const notification = notificationResp

    if (notification.recipientId.value !== recipientId)
      return left(new UnauthorizedError())

    notification.read()
    await this.notificationsRepository.update(notification)

    return right({ notification })
  }
}
