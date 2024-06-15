import { OrderUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-updates-repository'
import { UpdateOrder } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-order'

export class InMemoryOrderUpdatesRepository extends OrderUpdatesRepository {
  items: UpdateOrder[] = []

  async create(Updateorder: UpdateOrder): Promise<void> {
    this.items.push(Updateorder)
  }

  async update(Updateorder: UpdateOrder): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(Updateorder.id))

    if (index >= 0) {
      this.items[index] = Updateorder
    }
  }

  async findById(id: string): Promise<UpdateOrder | null> {
    const Updateorder = this.items.find((item) => item.id.value === id)

    return Updateorder ?? null
  }

  async findMany(): Promise<UpdateOrder[]> {
    const Updateorders = this.items

    return Updateorders
  }
}
