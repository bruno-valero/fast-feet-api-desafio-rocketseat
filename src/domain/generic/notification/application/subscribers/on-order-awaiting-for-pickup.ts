import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import SendNotificationUseCase from '../use-cases/send-notification'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { OrderAwaitingForPickupEvent } from '@/domain/core/deliveries-and-orders/enterprise/events/order-awaiting-for-pickup-event'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'

@Injectable()
export class OnOrderAwaitingForPickup implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      OrderAwaitingForPickupEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    order,
  }: OrderAwaitingForPickupEvent) {
    const currentOrder = await this.ordersRepository.findById(order.id.value)

    if (!currentOrder) return left(new ResourceNotFoundError())

    await this.sendNotificationUseCase.execute({
      recipientId: currentOrder.recipientId.value,
      title: `Seu pedido ${currentOrder.id.value} está aguardando o entregador retirá-lo`,
      content: `Em breve o entregador irá retirar seu pedido`,
    })
  }
}
