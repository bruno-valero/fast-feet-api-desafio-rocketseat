import { Order } from '../../../enterprise/entities/order'
import { Coordinates } from '../../../enterprise/entities/value-objects/coordinates'

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract update(order: Order): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(): Promise<Order[]>
  abstract findManyNearBy(coordinates: Coordinates): Promise<Order[]>
  abstract findManyByCourierId(courierId: string): Promise<Order[]>
  abstract findManyByRecipientId(recipientId: string): Promise<Order[]>
}
