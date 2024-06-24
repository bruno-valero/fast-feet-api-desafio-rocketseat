import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attatchment-type-error'
import { makeUploadOrderDeliveryPhotoUseCase } from 'test/factories/use-cases/order/make-upload-order-delivery-photo-use-case'
import { FakeUploader } from 'test/fake-storages/fake-uploader'

describe('upload order delivery photo use case', () => {
  let sut = makeUploadOrderDeliveryPhotoUseCase()
  beforeEach(() => {
    sut = makeUploadOrderDeliveryPhotoUseCase()
  })

  it('should be able to upload a order delivery photo', async () => {
    const sutResp = await sut.useCase.execute({
      body: Buffer.from('132'),
      fileName: 'teste',
      fileType: 'image/png',
    })

    expect(sutResp.isRight()).toBeTruthy()
    expect(
      (sut.dependencies.uploader as FakeUploader).uploads[0].fileName,
    ).toEqual('teste')
  })
  it('should not be able to upload a file that is not a image', async () => {
    const sutResp = await sut.useCase.execute({
      body: Buffer.from('132'),
      fileName: 'teste',
      fileType: 'application/pdf',
    })

    expect(sutResp.isRight()).toBeFalsy()
    expect(sutResp.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
