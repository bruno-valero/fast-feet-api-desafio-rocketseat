import { AttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/attachments-repository'
import { Uploader } from '@/domain/core/deliveries-and-orders/application/storage/uploader'
import { UploadOrderDeliveryPhotoUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/upload-order-delivery-photo-use-case'
import { FakeUploader } from 'test/fake-storages/fake-uploader'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

export function makeUploadOrderDeliveryPhotoUseCase(props?: {
  attachmentsRepositoryAlt: AttachmentsRepository
  uploaderAlt: Uploader
}) {
  const attachmentsRepository =
    props?.attachmentsRepositoryAlt ?? new InMemoryAttachmentsRepository()
  const uploader = props?.uploaderAlt ?? new FakeUploader()

  const useCase = new UploadOrderDeliveryPhotoUseCase(
    attachmentsRepository,
    uploader,
  )

  return {
    useCase,
    dependencies: {
      attachmentsRepository,
      uploader,
    },
  }
}
