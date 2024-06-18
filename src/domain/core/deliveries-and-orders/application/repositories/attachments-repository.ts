import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract create(update: Attachment): Promise<void>
  abstract findById(id: string): Promise<Attachment | null>
  abstract updateById(attachment: Attachment): Promise<void>
}
