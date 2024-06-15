import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'

export class InMemoryCouriersRepository extends CouriersRepository {
  items: Courier[] = []

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }

  async update(courier: Courier): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(courier.id))

    if (index >= 0) {
      this.items[index] = courier
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.value === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.id.value === id)

    return courier ?? null
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.cpf.equals(new Cpf(cpf)))

    return courier ?? null
  }

  async findMany(): Promise<Courier[]> {
    const couriers = this.items

    return couriers
  }
}
