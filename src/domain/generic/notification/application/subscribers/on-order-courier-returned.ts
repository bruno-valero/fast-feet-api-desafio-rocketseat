import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import SendNotificationUseCase from '../use-cases/send-notification'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { OrderCourierReturnedEvent } from '@/domain/core/deliveries-and-orders/enterprise/events/order-courier-returned-event'

@Injectable()
export class OnOrderCourierReturned implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      OrderCourierReturnedEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    order,
  }: OrderCourierReturnedEvent) {
    const currentOrder = await this.ordersRepository.findById(order.id.value)

    if (!currentOrder) return left(new ResourceNotFoundError())

    await this.sendNotificationUseCase.execute({
      recipientId: currentOrder.recipientId.value,
      title: `Um entregador aceitou realizar seu pedido ${currentOrder.id.value}`,
      content: `Em breve o entregador irá retirar seu pedido`,
    })
  }
}
