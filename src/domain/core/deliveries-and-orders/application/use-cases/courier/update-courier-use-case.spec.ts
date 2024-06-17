import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-register-courier-use-case'
import { makeUpdateCourierUseCase } from 'test/factories/use-cases/courier/make-update-courier-use-case'
import { Cpf } from '../../../enterprise/entities/value-objects/cpf'

describe('update courier use case', () => {
  let createCourier = makeRegisterCourierUseCase()
  let sut = makeUpdateCourierUseCase({
    admsRepositoryAlt: createCourier.dependencies.admsRepository,
    couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
  })
  beforeEach(() => {
    createCourier = makeRegisterCourierUseCase()
    sut = makeUpdateCourierUseCase({
      admsRepositoryAlt: createCourier.dependencies.admsRepository,
      couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
    })
  })

  it('should be able to update a courier', async () => {
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
      cpf: '44411132112',
      name: 'bruno-2',
      requestResponsibleId: adm.id.value,
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(couriers).toHaveLength(1)
    expect(couriers[0]).toEqual(
      expect.objectContaining({
        name: 'bruno-2',
        cpf: new Cpf('44411132112'),
      }),
    )
  })

  it('should be able to register metadata from the updated courier', async () => {
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
      cpf: '44411132112',
      name: 'bruno-2',
      requestResponsibleId: adm.id.value,
    })

    const updates = await sut.dependencies.courierUpdatesRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(updates).toHaveLength(1)
    expect(updates[0].updatedBy.equals(adm.id)).toEqual(true)
  })

  it('should not be able to update a courier if the action is not made by an adm', async () => {
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
      cpf: '44411132112',
      name: 'bruno-2',
      requestResponsibleId: 'any Id',
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(couriers).toHaveLength(1)
    expect(couriers[0]).toEqual(
      expect.objectContaining({
        name: 'bruno',
        cpf: new Cpf('44411166677'),
      }),
    )
  })
})
