import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'

export class InMemoryOrdersRepository extends OrdersRepository {
  items: Order[] = []
  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id))

    if (index >= 0) {
      this.items[index] = order
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.value === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.value === id)

    return order ?? null
  }

  async findMany(): Promise<Order[]> {
    const orders = this.items

    return orders
  }

  async findManyByCourierId(courierId: string): Promise<Order[]> {
    const orders = this.items.filter(
      (item) => !item.courierId?.value || item.courierId?.value === courierId,
    )

    return orders
  }
}
