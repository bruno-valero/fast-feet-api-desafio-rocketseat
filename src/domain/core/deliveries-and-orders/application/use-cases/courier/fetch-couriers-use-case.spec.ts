import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-register-courier-use-case'
import { makeFetchCouriersUseCase } from 'test/factories/use-cases/courier/make-fetch-couriers-use-case'
import { Cpf } from '../../../enterprise/entities/value-objects/cpf'

describe('fetch couriers use case', () => {
  let createCourier = makeRegisterCourierUseCase()
  let sut = makeFetchCouriersUseCase({
    admsRepositoryAlt: createCourier.dependencies.admsRepository,
    couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
  })
  beforeEach(() => {
    createCourier = makeRegisterCourierUseCase()
    sut = makeFetchCouriersUseCase({
      admsRepositoryAlt: createCourier.dependencies.admsRepository,
      couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
    })
  })

  it('should be able to fetch couriers', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createCourier.useCase.execute({
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
      expect(sutResp.value.couriers).toHaveLength(1)
      expect(sutResp.value.couriers[0]).toEqual(
        expect.objectContaining({
          cpf: new Cpf('44411166677'),
          name: 'bruno',
        }),
      )
    }
  })

  it('should not be able to fetch couriers if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createCourier.useCase.execute({
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
