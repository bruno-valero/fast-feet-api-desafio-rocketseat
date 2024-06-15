import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-register-courier-use-case'
import { makeDeleteCourierUseCase } from 'test/factories/use-cases/courier/make-delete-courier-use-case'

describe('delete courier use case', () => {
  let createCourier = makeRegisterCourierUseCase()
  let sut = makeDeleteCourierUseCase({
    admsRepositoryAlt: createCourier.dependencies.admsRepository,
    couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
  })
  beforeEach(() => {
    createCourier = makeRegisterCourierUseCase()
    sut = makeDeleteCourierUseCase({
      admsRepositoryAlt: createCourier.dependencies.admsRepository,
      couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
    })
  })

  it('should be able to delete a courier', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createCourier.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      courierId: courier.id.value,
      requestResponsibleId: adm.id.value,
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(couriers).toHaveLength(0)
  })

  it('should not be able to delete a courier if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createCourier.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      courierId: courier.id.value,
      requestResponsibleId: 'any Id',
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(couriers).toHaveLength(1)
  })
})
