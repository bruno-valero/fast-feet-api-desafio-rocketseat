import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-authenticate-recipient-use-case'
import { makeRegisterRecipientUseCase } from 'test/factories/use-cases/auth-and-register/make-register-recipient-use-case'

describe('authenticate courier use case', () => {
  let createRecipient = makeRegisterRecipientUseCase()
  let sut = makeAuthenticateRecipientUseCase({
    recipientsRepositoryAlt: createRecipient.dependencies.recipientsRepository,
  })
  beforeEach(() => {
    createRecipient = makeRegisterRecipientUseCase()
    sut = makeAuthenticateRecipientUseCase({
      recipientsRepositoryAlt:
        createRecipient.dependencies.recipientsRepository,
    })
  })

  it('should be able to authenticate a courier', async () => {
    await createRecipient.dependencies.admsRepository.create(makeAdm())

    const adm = (
      await createRecipient.dependencies.admsRepository.findMany()
    )[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      password: '123',
    })

    expect(sutResp.isRight()).toBeTruthy()
    expect(sutResp.value).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    )
  })

  it('should not be able to authenticate a courier with wrong password', async () => {
    await createRecipient.dependencies.admsRepository.create(makeAdm())

    const adm = (
      await createRecipient.dependencies.admsRepository.findMany()
    )[0]

    await createRecipient.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      password: '1235',
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(UnauthorizedError)
  })
})
