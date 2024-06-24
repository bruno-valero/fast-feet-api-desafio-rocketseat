import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Attachment } from '../../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../../repositories/attachments-repository'
import { Uploader } from '../../storage/uploader'
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attatchment-type-error'

export interface UploadOrderDeliveryPhotoUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

export type UploadOrderDeliveryPhotoUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadOrderDeliveryPhotoUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadOrderDeliveryPhotoUseCaseRequest): Promise<UploadOrderDeliveryPhotoUseCaseResponse> {
    if (!/^image\/(jpeg|png|jpg)$/gi.test(fileType))
      return left(new InvalidAttachmentTypeError(fileType))

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
