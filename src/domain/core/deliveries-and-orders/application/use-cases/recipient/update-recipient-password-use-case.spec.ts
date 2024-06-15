import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'
import { makeUpdateRecipientPasswordUseCase } from 'test/factories/use-cases/recipient/make-update-recipient-password-use-case'

describe('update recipient password use case', () => {
  let createRecipient = makeRegisterRecipientUseCase()
  let sut = makeUpdateRecipientPasswordUseCase({
    admsRepositoryAlt: createRecipient.dependencies.admsRepository,
    recipientsRepositoryAlt: createRecipient.dependencies.recipientsRepository,
  })
  beforeEach(() => {
    createRecipient = makeRegisterRecipientUseCase()
    sut = makeUpdateRecipientPasswordUseCase({
      admsRepositoryAlt: createRecipient.dependencies.admsRepository,
      recipientsRepositoryAlt:
        createRecipient.dependencies.recipientsRepository,
    })
  })

  it('should be able to update a recipient password', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const recipient = (
      await sut.dependencies.recipientsRepository.findMany()
    )[0]

    const sutResp = await sut.useCase.execute({
      recipientId: recipient.id.value,
      password: '44411132112',
      requestResponsibleId: adm.id.value,
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(recipients).toHaveLength(1)
    expect(
      await sut.dependencies.encrypter.compare('123', recipients[0].password),
    ).toEqual(false)
    expect(
      await sut.dependencies.encrypter.compare(
        '44411132112',
        recipients[0].password,
      ),
    ).toEqual(true)
  })

  it('should be able to register metadata from the updated recipient password', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const recipient = (
      await sut.dependencies.recipientsRepository.findMany()
    )[0]

    const sutResp = await sut.useCase.execute({
      recipientId: recipient.id.value,
      password: '44411132112',
      requestResponsibleId: adm.id.value,
    })

    const updates = await sut.dependencies.recipientUpdatesRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(updates).toHaveLength(1)
    expect(updates[0].updatedBy.equals(adm.id)).toEqual(true)
  })

  it('should not be able to update a recipient password if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const recipient = (
      await sut.dependencies.recipientsRepository.findMany()
    )[0]

    const sutResp = await sut.useCase.execute({
      recipientId: recipient.id.value,
      password: '44411132112',
      requestResponsibleId: 'any Id',
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(recipients).toHaveLength(1)
    expect(
      await sut.dependencies.encrypter.compare('123', recipients[0].password),
    ).toEqual(true)
    expect(
      await sut.dependencies.encrypter.compare(
        '44411132112',
        recipients[0].password,
      ),
    ).toEqual(false)
  })
})
