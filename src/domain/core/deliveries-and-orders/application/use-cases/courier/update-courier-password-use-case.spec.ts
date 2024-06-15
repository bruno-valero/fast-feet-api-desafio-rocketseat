import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-register-courier-use-case'
import { makeUpdateCourierPasswordUseCase } from 'test/factories/use-cases/courier/make-update-courier-password-use-case'

describe('update courier password use case', () => {
  let createCourier = makeRegisterCourierUseCase()
  let sut = makeUpdateCourierPasswordUseCase({
    admsRepositoryAlt: createCourier.dependencies.admsRepository,
    couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
  })
  beforeEach(() => {
    createCourier = makeRegisterCourierUseCase()
    sut = makeUpdateCourierPasswordUseCase({
      admsRepositoryAlt: createCourier.dependencies.admsRepository,
      couriersRepositoryAlt: createCourier.dependencies.couriersRepository,
    })
  })

  it('should be able to update a courier password', async () => {
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
      password: '44411132112',
      requestResponsibleId: adm.id.value,
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(couriers).toHaveLength(1)
    expect(
      await sut.dependencies.encrypter.compare('123', couriers[0].password),
    ).toEqual(false)
    expect(
      await sut.dependencies.encrypter.compare(
        '44411132112',
        couriers[0].password,
      ),
    ).toEqual(true)
  })

  it('should be able to register metadata from the updated courier password', async () => {
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
      password: '44411132112',
      requestResponsibleId: adm.id.value,
    })

    const updates = await sut.dependencies.courierUpdatesRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(updates).toHaveLength(1)
    expect(updates[0].updatedBy.equals(adm.id)).toEqual(true)
  })

  it('should not be able to update a courier password if the action is not made by an adm', async () => {
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
      password: '44411132112',
      requestResponsibleId: 'any Id',
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(couriers).toHaveLength(1)
    expect(
      await sut.dependencies.encrypter.compare('123', couriers[0].password),
    ).toEqual(true)
    expect(
      await sut.dependencies.encrypter.compare(
        '44411132112',
        couriers[0].password,
      ),
    ).toEqual(false)
  })
})
