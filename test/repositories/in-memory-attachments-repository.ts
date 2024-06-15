import { AttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/attachments-repository'
import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository extends AttachmentsRepository {
  items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
