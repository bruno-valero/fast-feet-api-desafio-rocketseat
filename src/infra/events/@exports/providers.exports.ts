import { OnOrderAwaitingForPickup } from '@/domain/generic/notification/application/subscribers/on-order-awaiting-for-pickup'
import { OnOrderCourierAccepted } from '@/domain/generic/notification/application/subscribers/on-order-courier-accepted'
import { OnOrderCourierCanceled } from '@/domain/generic/notification/application/subscribers/on-order-courier-canceled'
import { OnOrderCourierCollected } from '@/domain/generic/notification/application/subscribers/on-order-courier-collected'
import { OnOrderCourierDeliver } from '@/domain/generic/notification/application/subscribers/on-order-courier-deliver'
import { OnOrderCourierReturned } from '@/domain/generic/notification/application/subscribers/on-order-courier-returned'
import SendNotificationUseCase from '@/domain/generic/notification/application/use-cases/send-notification'
import { Provider } from '@nestjs/common'

const notificationEventss: Provider[] = [
  OnOrderAwaitingForPickup,
  OnOrderCourierAccepted,
  OnOrderCourierCanceled,
  OnOrderCourierCollected,
  OnOrderCourierDeliver,
  OnOrderCourierReturned,
]

const notificationUseCases: Provider[] = [SendNotificationUseCase]

export const providers: Provider[] = [
  ...notificationEventss,
  ...notificationUseCases,
]
