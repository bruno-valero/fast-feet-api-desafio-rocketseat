import { AdmUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adm-updates-repository'
import { UpdateAdm } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-adm'

export class InMemoryAdmUpdatesRepository extends AdmUpdatesRepository {
  items: UpdateAdm[] = []

  async create(Updateadm: UpdateAdm): Promise<void> {
    this.items.push(Updateadm)
  }

  async update(Updateadm: UpdateAdm): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(Updateadm.id))

    if (index >= 0) {
      this.items[index] = Updateadm
    }
  }

  async findById(id: string): Promise<UpdateAdm | null> {
    const Updateadm = this.items.find((item) => item.id.value === id)

    return Updateadm ?? null
  }

  async findMany(): Promise<UpdateAdm[]> {
    const Updateadms = this.items

    return Updateadms
  }
}
