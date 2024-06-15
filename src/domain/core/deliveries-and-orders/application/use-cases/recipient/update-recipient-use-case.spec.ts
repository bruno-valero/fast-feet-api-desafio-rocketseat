import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'
import { makeUpdateRecipientUseCase } from 'test/factories/use-cases/recipient/make-update-recipient-use-case'
import { Cpf } from '../../../enterprise/entities/value-objects/cpf'

describe('update recipient use case', () => {
  let createRecipient = makeRegisterRecipientUseCase()
  let sut = makeUpdateRecipientUseCase({
    admsRepositoryAlt: createRecipient.dependencies.admsRepository,
    recipientsRepositoryAlt: createRecipient.dependencies.recipientsRepository,
  })
  beforeEach(() => {
    createRecipient = makeRegisterRecipientUseCase()
    sut = makeUpdateRecipientUseCase({
      admsRepositoryAlt: createRecipient.dependencies.admsRepository,
      recipientsRepositoryAlt:
        createRecipient.dependencies.recipientsRepository,
    })
  })

  it('should be able to update a recipient', async () => {
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
      cpf: '44411132112',
      name: 'bruno-2',
      admId: adm.id.value,
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(recipients).toHaveLength(1)
    expect(recipients[0]).toEqual(
      expect.objectContaining({
        name: 'bruno-2',
        cpf: new Cpf('44411132112'),
      }),
    )
  })

  it('should be able to register metadata from the updated recipient', async () => {
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
      cpf: '44411132112',
      name: 'bruno-2',
      admId: adm.id.value,
    })

    const updates = await sut.dependencies.recipientUpdatesRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(updates).toHaveLength(1)
    expect(updates[0].updatedBy.equals(adm.id)).toEqual(true)
  })

  it('should not be able to update a recipient if the action is not made by an adm', async () => {
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
      cpf: '44411132112',
      name: 'bruno-2',
      admId: 'any Id',
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(recipients).toHaveLength(1)
    expect(recipients[0]).toEqual(
      expect.objectContaining({
        name: 'bruno',
        cpf: new Cpf('44411166677'),
      }),
    )
  })
})
