import { UpdateOrder } from '../../../enterprise/entities/update-order'

export abstract class OrderUpdatesRepository {
  abstract create(update: UpdateOrder): Promise<void>
  abstract update(update: UpdateOrder): Promise<void>
  abstract findById(id: string): Promise<UpdateOrder | null>
  abstract findMany(): Promise<UpdateOrder[]>
}
