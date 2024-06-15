import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Address } from './value-objects/address'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { OrderAlreadyAcceptedError } from '@/core/errors/errors/order-errors/order-already-accepted-error'
import { OrderIsClosedError } from '@/core/errors/errors/order-errors/order-is-closed-error'
import { OrderAwaitingPickupError } from '@/core/errors/errors/order-errors/order-awaiting-for-pickup-error'
import { OrderCourierDeliverEvent } from '../events/order-courier-deliver-event'
import { OrderCourierCanceledEvent } from '../events/order-courier-canceled-event'
import { OrderNotAcceptedError } from '@/core/errors/errors/order-errors/order-not-accepted-error'
import { OrderCourierAcceptedEvent } from '../events/order-courier-accepted-event'
import { OrderAwaitingForPickupEvent } from '../events/order-awaiting-for-pickup-event'
import { OrderNotDeliveredError } from '@/core/errors/errors/order-errors/order-not-delivered-error'
import { OrderCourierReturnedEvent } from '../events/order-courier-returned-event'
import { UpdateOrder } from './update-order'
import { OrderAttachment } from './order-attachment'
import { OrderAlreadyReturnedError } from '@/core/errors/errors/order-errors/order-already-returned-error copy'

export interface OrderProps {
  recipientId: UniqueEntityId
  courierId: UniqueEntityId | null
  address: Address
  delivered: Date | null
  deliveredPhoto: OrderAttachment | null
  awaitingPickup: Date | null
  collected: Date | null
  returned: Date | null
  returnCause: string | null
  createdAt: Date
  updatedAt: Date | null
}

export type OrderCreateProps = Optional<
  OrderProps,
  | 'collected'
  | 'returned'
  | 'returnCause'
  | 'delivered'
  | 'deliveredPhoto'
  | 'createdAt'
  | 'updatedAt'
>

export type UpdateOrderReturn<errors> = { data?: UpdateOrder; error?: errors }

export type OrderToJsonData = {
  id: string
  address: Address['raw']
  awaitingPickup: string | null
  collected: string | null
  courierId: string | null
  createdAt: string
  delivered: string | null
  deliveredPhoto: OrderAttachment['raw'] | null
  recipientId: string
  returnCause: string | null
  returned: string | null
  updatedAt: string | null
}

export class Order extends AggregateRoot<OrderProps> {
  static create(props: OrderCreateProps, id?: UniqueEntityId) {
    return new Order(
      {
        ...props,
        delivered: props.delivered ?? null,
        deliveredPhoto: props.deliveredPhoto ?? null,
        collected: props.collected ?? null,
        returned: props.returned ?? null,
        returnCause: props.returnCause ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )
  }

  toJson(spacing?: number) {
    const data: OrderToJsonData = {
      id: this.id.value,
      address: this.address.raw,
      awaitingPickup: this.awaitingPickup?.toISOString() ?? null,
      collected: this.collected?.toISOString() ?? null,
      courierId: this.courierId?.value ?? null,
      createdAt: this.createdAt?.toISOString() ?? null,
      delivered: this.delivered?.toISOString() ?? null,
      deliveredPhoto: this.deliveredPhoto?.raw ?? null,
      recipientId: this.recipientId.value,
      returnCause: this.returnCause,
      returned: this.returned?.toISOString() ?? null,
      updatedAt: this.updatedAt?.toISOString() ?? null,
    }

    return JSON.stringify(data, null, spacing)
  }

  parseFromJson(json: string) {
    const data = JSON.parse(json) as OrderToJsonData

    const dateFrom = (data: string | null) => new Date(data ?? '')

    const order = Order.create(
      {
        address: new Address(data.address),
        awaitingPickup: dateFrom(data.awaitingPickup),
        courierId: new UniqueEntityId(data.courierId ?? undefined),
        recipientId: new UniqueEntityId(data.recipientId),
        collected: dateFrom(data.collected),
        createdAt: dateFrom(data.createdAt),
        delivered: dateFrom(data.delivered),
        deliveredPhoto: OrderAttachment.create({
          attachmentId: new UniqueEntityId(data.deliveredPhoto?.attachmentId),
          orderId: new UniqueEntityId(data.deliveredPhoto?.orderId),
        }),
        returnCause: data.returnCause,
        returned: dateFrom(data.returned),
        updatedAt: dateFrom(data.updatedAt),
      },
      new UniqueEntityId(data.id),
    )

    return order
  }

  private update(callback: () => void, updatedBy: UniqueEntityId) {
    const before = new Order(this.props, this.id)

    callback()
    this.touch()

    const updateOrder = UpdateOrder.create({
      objectId: this.id,
      updatedBy,
      changes: {
        before,
        after: this,
      },
    })

    return updateOrder
  }

  changeData() {}

  private admSetAwaitingPickup(
    updatedBy: UniqueEntityId,
  ): UpdateOrderReturn<OrderAwaitingPickupError | OrderIsClosedError> {
    const awaitingPickup = !!this.props.awaitingPickup
    const isOrderClosed = this.isOrderClosed

    if (awaitingPickup) return { error: new OrderAwaitingPickupError() }
    if (isOrderClosed) return { error: new OrderIsClosedError() }

    const updateOrder = this.update(() => {
      this.props.awaitingPickup = new Date()
      this.addDomainEvent(new OrderAwaitingForPickupEvent(this))
    }, updatedBy)

    return { data: updateOrder }
  }

  private admCollected(
    updatedBy: UniqueEntityId,
  ): UpdateOrderReturn<OrderAwaitingPickupError | OrderIsClosedError> {
    const awaitingPickup = !!this.props.awaitingPickup
    const isOrderClosed = this.isOrderClosed

    if (awaitingPickup) return { error: new OrderAwaitingPickupError() }
    if (isOrderClosed) return { error: new OrderIsClosedError() }

    const updateOrder = this.update(() => {
      this.props.collected = new Date()
      this.addDomainEvent(new OrderCourierAcceptedEvent(this))
    }, updatedBy)

    return { data: updateOrder }
  }

  private admReturned(
    returnCause: string,
    updatedBy: UniqueEntityId,
  ): UpdateOrderReturn<
    | OrderAwaitingPickupError
    | OrderAlreadyReturnedError
    | OrderNotDeliveredError
  > {
    const awaitingPickup = !!this.props.awaitingPickup
    const delivered = !!this.props.delivered
    const returned = !!this.props.returned

    if (awaitingPickup) return { error: new OrderAwaitingPickupError() }
    if (returned) return { error: new OrderAlreadyReturnedError() }
    if (!delivered) return { error: new OrderNotDeliveredError() }

    const updateOrder = this.update(() => {
      this.props.returned = new Date()
      this.props.returnCause = returnCause
      this.addDomainEvent(new OrderCourierReturnedEvent(this))
    }, updatedBy)

    return { data: updateOrder }
  }

  private courierAccept(
    courierId: UniqueEntityId,
    updatedBy: UniqueEntityId,
  ): UpdateOrderReturn<OrderAlreadyAcceptedError> {
    if (this.props.courierId) return { error: new OrderAlreadyAcceptedError() }

    const updateOrder = this.update(() => {
      this.props.courierId = courierId
      this.addDomainEvent(new OrderCourierAcceptedEvent(this))
    }, updatedBy)

    return { data: updateOrder }
  }

  private courierReject(
    updatedBy: UniqueEntityId,
  ): UpdateOrderReturn<OrderNotAcceptedError> {
    if (!this.props.courierId) return { error: new OrderNotAcceptedError() }

    const updateOrder = this.update(() => {
      this.props.courierId = null
      this.addDomainEvent(new OrderCourierCanceledEvent(this))
    }, updatedBy)

    return { data: updateOrder }
  }

  private courierDeliver(
    updatedBy: UniqueEntityId,
  ): UpdateOrderReturn<OrderAwaitingPickupError | OrderIsClosedError> {
    const awaitingPickup = !!this.props.awaitingPickup
    const isOrderClosed = this.isOrderClosed

    if (awaitingPickup) return { error: new OrderAwaitingPickupError() }
    if (isOrderClosed) return { error: new OrderIsClosedError() }

    // const canDeliver = !awaitingPickup && !isOrderClosed

    const updateOrder = this.update(() => {
      this.props.delivered = new Date()
      this.addDomainEvent(new OrderCourierDeliverEvent(this))
    }, updatedBy)

    return { data: updateOrder }
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get actions() {
    // adm
    const admSetAwaitingPickup = this.admSetAwaitingPickup
    const admCollected = this.admCollected
    const admReturned = this.admReturned

    // courier
    const courierAccept = this.courierAccept
    const courierReject = this.courierReject
    const courierDeliver = this.courierDeliver

    return {
      courier: {
        courierAccept,
        courierReject,
        courierDeliver,
      },
      adm: {
        admSetAwaitingPickup,
        admCollected,
        admReturned,
      },
    }
  }

  get isOrderClosed() {
    const returned = !!this.props.returned
    const collected = !!this.props.collected
    const delivered = !!this.props.delivered

    const isOrderClosed = returned || collected || delivered

    return isOrderClosed
  }

  get recipientId() {
    return this.props.recipientId
  }

  get courierId() {
    return this.props.courierId
  }

  get address() {
    return this.props.address
  }

  get delivered() {
    return this.props.delivered
  }

  get deliveredPhoto() {
    return this.props.deliveredPhoto
  }

  get awaitingPickup() {
    return this.props.awaitingPickup
  }

  get collected() {
    return this.props.collected
  }

  get returned() {
    return this.props.returned
  }

  get returnCause() {
    return this.props.returnCause
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}