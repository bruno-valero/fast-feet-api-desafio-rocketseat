import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'
import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'

export class InMemoryRecipientsRepository extends RecipientsRepository {
  items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async update(recipient: Recipient): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(recipient.id))

    if (index >= 0) {
      this.items[index] = recipient
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.value === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.value === id)

    return recipient ?? null
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.cpf.equals(new Cpf(cpf)))

    return recipient ?? null
  }

  async findMany(): Promise<Recipient[]> {
    const recipients = this.items

    return recipients
  }
}
