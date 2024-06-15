import UniqueEntityId from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/order'

export class OrderDeliveredEvent implements DomainEvent {
  ocurredAt: Date
  private _order: Order

  constructor(order: Order) {
    this._order = order
    this.ocurredAt = new Date()
  }

  get order() {
    return this._order
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
