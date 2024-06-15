import { CourierUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-updates-repository'
import { UpdateCourier } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-courier'

export class InMemoryCourierUpdatesRepository extends CourierUpdatesRepository {
  items: UpdateCourier[] = []

  async create(Updatecourier: UpdateCourier): Promise<void> {
    this.items.push(Updatecourier)
  }

  async update(Updatecourier: UpdateCourier): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(Updatecourier.id),
    )

    if (index >= 0) {
      this.items[index] = Updatecourier
    }
  }

  async findById(id: string): Promise<UpdateCourier | null> {
    const Updatecourier = this.items.find((item) => item.id.value === id)

    return Updatecourier ?? null
  }

  async findMany(): Promise<UpdateCourier[]> {
    const Updatecouriers = this.items

    return Updatecouriers
  }
}
