import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'
import { makeFetchRecipientsUseCase } from 'test/factories/use-cases/recipient/make-fetch-recipients-use-case'
import { Cpf } from '../../../enterprise/entities/value-objects/cpf'

describe('fetch recipients use case', () => {
  let createRecipient = makeRegisterRecipientUseCase()
  let sut = makeFetchRecipientsUseCase({
    admsRepositoryAlt: createRecipient.dependencies.admsRepository,
    recipientsRepositoryAlt: createRecipient.dependencies.recipientsRepository,
  })
  beforeEach(() => {
    createRecipient = makeRegisterRecipientUseCase()
    sut = makeFetchRecipientsUseCase({
      admsRepositoryAlt: createRecipient.dependencies.admsRepository,
      recipientsRepositoryAlt:
        createRecipient.dependencies.recipientsRepository,
    })
  })

  it('should be able to fetch recipients', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: adm.id.value,
    })

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(sutResp.value.recipients).toHaveLength(1)
      expect(sutResp.value.recipients[0]).toEqual(
        expect.objectContaining({
          cpf: new Cpf('44411166677'),
          name: 'bruno',
        }),
      )
    }
  })

  it('should not be able to fetch recipients if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: 'any Id',
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
