import { RecipientUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipient-updates-repository'
import { UpdateRecipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-recipient'

export class InMemoryRecipientUpdatesRepository extends RecipientUpdatesRepository {
  items: UpdateRecipient[] = []

  async create(Updaterecipient: UpdateRecipient): Promise<void> {
    this.items.push(Updaterecipient)
  }

  async update(Updaterecipient: UpdateRecipient): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(Updaterecipient.id),
    )

    if (index >= 0) {
      this.items[index] = Updaterecipient
    }
  }

  async findById(id: string): Promise<UpdateRecipient | null> {
    const Updaterecipient = this.items.find((item) => item.id.value === id)

    return Updaterecipient ?? null
  }

  async findMany(): Promise<UpdateRecipient[]> {
    const Updaterecipients = this.items

    return Updaterecipients
  }
}
