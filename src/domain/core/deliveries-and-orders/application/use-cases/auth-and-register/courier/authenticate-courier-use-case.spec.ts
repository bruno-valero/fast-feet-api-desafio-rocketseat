import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-authenticate-courier-use-case'
import { makeRegisterCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-register-courier-use-case'

describe('authenticate courier use case', () => {
  let createCourier = makeRegisterCourierUseCase()
  let sut = makeAuthenticateCourierUseCase({
    couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
  })
  beforeEach(() => {
    createCourier = makeRegisterCourierUseCase()
    sut = makeAuthenticateCourierUseCase({
      couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
    })
  })

  it('should be able to authenticate a courier', async () => {
    await createCourier.dependencies.admsRepository.create(makeAdm())

    const adm = (await createCourier.dependencies.admsRepository.findMany())[0]

    await createCourier.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

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

  it('should not be able to authenticate a courier with wrong password', async () => {
    await createCourier.dependencies.admsRepository.create(makeAdm())

    const adm = (await createCourier.dependencies.admsRepository.findMany())[0]

    await createCourier.useCase.execute({
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
