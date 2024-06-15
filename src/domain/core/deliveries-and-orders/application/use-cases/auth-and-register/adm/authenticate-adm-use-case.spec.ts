import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateAdmUseCase } from 'test/factories/use-cases/auth-and-register/make-authenticate-adm-use-case'

describe('authenticate adm use case', () => {
  let sut = makeAuthenticateAdmUseCase()
  beforeEach(() => {
    sut = makeAuthenticateAdmUseCase()
  })

  it('should be able to authenticate a adm', async () => {
    await sut.dependencies.admsRepository.create(
      makeAdm({
        cpf: new Cpf('44411166677'),
        password: await sut.dependencies.encrypter.hash('123'),
      }),
    )

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      password: '123',
    })

    console.log('sutResp.value', sutResp.value)
    expect(sutResp.isRight()).toBeTruthy()
    expect(sutResp.value).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    )
  })

  it('should not be able to authenticate a adm with wrong password', async () => {
    await sut.dependencies.admsRepository.create(
      makeAdm({
        cpf: new Cpf('44411166677'),
        password: await sut.dependencies.encrypter.hash('123'),
      }),
    )

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      password: '1235',
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(UnauthorizedError)
  })
})
