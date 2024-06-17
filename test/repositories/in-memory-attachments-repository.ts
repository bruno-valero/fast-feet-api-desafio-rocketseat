import { AttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/attachments-repository'
import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository extends AttachmentsRepository {
  items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }

  async findById(id: string): Promise<Attachment | null> {
    return this.items.find((item) => item.id.value === id) ?? null
  }

  async updateById(attachment: Attachment): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.orderId?.equals(attachment.id),
    )

    if (index >= 0) {
      this.items[index] = attachment
    }
  }
}
