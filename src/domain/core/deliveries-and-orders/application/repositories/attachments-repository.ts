import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment'

@Injectable()
export abstract class AttachmentsRepository {
  abstract create(update: Attachment): Promise<void>
  abstract findById(id: string): Promise<Attachment | null>
  abstract updateById(attachment: Attachment): Promise<void>
}
