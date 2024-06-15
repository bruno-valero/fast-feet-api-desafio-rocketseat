import { Injectable } from '@nestjs/common'
import { Order } from '../../../enterprise/entities/order'

@Injectable()
export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract update(order: Order): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(): Promise<Order[]>
  abstract findManyByCourierId(courierId: string): Promise<Order[]>
}
