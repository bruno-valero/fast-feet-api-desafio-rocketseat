import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { Adm } from '@/domain/core/deliveries-and-orders/enterprise/entities/adm'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'

export class InMemoryAdmsRepository extends AdmsRepository {
  items: Adm[] = []

  async create(adm: Adm): Promise<void> {
    this.items.push(adm)
  }

  async update(adm: Adm): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(adm.id))

    if (index >= 0) {
      this.items[index] = adm
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.value === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string): Promise<Adm | null> {
    const adm = this.items.find((item) => item.id.value === id)

    return adm ?? null
  }

  async findByCpf(cpf: string): Promise<Adm | null> {
    const adm = this.items.find((item) => item.cpf.equals(new Cpf(cpf)))

    return adm ?? null
  }

  async findMany(): Promise<Adm[]> {
    const adms = this.items

    return adms
  }
}
