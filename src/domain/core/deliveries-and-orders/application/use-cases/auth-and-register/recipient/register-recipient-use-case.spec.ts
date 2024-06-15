import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'

describe('register recipient use case', () => {
  let sut = makeRegisterRecipientUseCase()
  beforeEach(() => {
    sut = makeRegisterRecipientUseCase()
  })

  it('should be able to register a new recipient', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(recipients).toHaveLength(1)
    expect(recipients[0]).toEqual(
      expect.objectContaining({
        name: 'bruno',
      }),
    )
  })

  it('should be able to encrypt the recipient on registration', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(recipients).toHaveLength(1)
    expect(
      await sut.dependencies.encrypter.compare('123', recipients[0].password),
    ).toEqual(true)
  })

  it('should not be able to register a new recipient if the action is not made by an adm', async () => {
    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: 'any id',
    })

    const recipients = await sut.dependencies.recipientsRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(recipients).toHaveLength(0)
  })
})
