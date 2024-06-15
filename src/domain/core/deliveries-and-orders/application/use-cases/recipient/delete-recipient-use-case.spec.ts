import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'
import { makeDeleteRecipientUseCase } from 'test/factories/use-cases/recipient/make-delete-recipient-use-case'

describe('delete recipient use case', () => {
  let createRecipient = makeRegisterRecipientUseCase()
  let sut = makeDeleteRecipientUseCase({
    admsRepositoryAlt: createRecipient.dependencies.admsRepository,
    recipientsRepositoryAlt: createRecipient.dependencies.recipientsRepository,
  })
  beforeEach(() => {
    createRecipient = makeRegisterRecipientUseCase()
    sut = makeDeleteRecipientUseCase({
      admsRepositoryAlt: createRecipient.dependencies.admsRepository,
      recipientsRepositoryAlt:
        createRecipient.dependencies.recipientsRepository,
    })
  })

  it('should be able to delete a recipient', async () => {
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
      requestResponsibleId: adm.id.value,
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(recipients).toHaveLength(0)
  })

  it('should not be able to delete a recipient if the action is not made by an adm', async () => {
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
      requestResponsibleId: 'any Id',
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(recipients).toHaveLength(1)
  })
})
