import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'
import { makeFindRecipientUseCase } from 'test/factories/use-cases/recipient/make-find-recipient-use-case'
import { Cpf } from '../../../enterprise/entities/value-objects/cpf'

describe('find recipient use case', () => {
  let createRecipient = makeRegisterRecipientUseCase()
  let sut = makeFindRecipientUseCase({
    admsRepositoryAlt: createRecipient.dependencies.admsRepository,
    recipientsRepositoryAlt: createRecipient.dependencies.recipientsRepository,
  })
  beforeEach(() => {
    createRecipient = makeRegisterRecipientUseCase()
    sut = makeFindRecipientUseCase({
      admsRepositoryAlt: createRecipient.dependencies.admsRepository,
      recipientsRepositoryAlt:
        createRecipient.dependencies.recipientsRepository,
    })
  })

  it('should be able to find a recipient', async () => {
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
    expect(sutResp.value).toEqual({
      recipient: expect.objectContaining({
        cpf: new Cpf('44411166677'),
        name: 'bruno',
      }),
    })
    expect(recipients).toHaveLength(1)
  })

  it('should not be able to find a recipient if the action is not made by an adm', async () => {
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
