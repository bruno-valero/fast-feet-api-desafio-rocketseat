import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { makeFetchNearbyOrdersUseCase } from 'test/factories/use-cases/order/make-fetch-nearby-orders-use-case'
import { makeCourier } from 'test/factories/entities/makeCourier'
import { Coordinates } from '../../../enterprise/entities/value-objects/coordinates'

describe('fetch nearby orders use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeFetchNearbyOrdersUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeFetchNearbyOrdersUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to fetch nearby orders', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await sut.dependencies.couriersRepository.create(makeCourier())
    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress({
          coordinates: new Coordinates({
            latitude: -23.3798813,
            longitude: -46.2576877,
          }),
        }),
        courierId: courier.id,
        recipientId: new UniqueEntityId('1188'),
      },
    })
    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress({
          coordinates: new Coordinates({
            latitude: -23.3798813,
            longitude: -46.2576877,
          }),
        }),
        courierId: courier.id,
        recipientId: new UniqueEntityId('1188'),
      },
    })

    // 9 km distance
    // -23.3798813,-46.2576877

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: courier.id.value,
      courierId: courier.id.value,
      requestResponsibleRole: 'courier',
      coordinates: {
        latitude: -23.3963853,
        longitude: -46.3086881,
      },
    })
    // courier ccordinates
    // -23.3963853,-46.3086881

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(sutResp.value.orders).toHaveLength(2)
    }
  })

  it('should not be able to fetch far away orders', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await sut.dependencies.couriersRepository.create(makeCourier())
    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress({
          coordinates: new Coordinates({
            latitude: -23.3571925,
            longitude: -46.2076257,
          }),
        }),
        courierId: courier.id,
        recipientId: new UniqueEntityId('1188'),
      },
    })
    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress({
          coordinates: new Coordinates({
            latitude: -23.3571925,
            longitude: -46.2076257,
          }),
        }),
        courierId: courier.id,
        recipientId: new UniqueEntityId('1188'),
      },
    })

    // 9 km distance
    // -23.3798813,-46.2576877

    // 15 km distance
    // -23.3571925,-46.2076257

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: courier.id.value,
      courierId: courier.id.value,
      requestResponsibleRole: 'courier',
      coordinates: {
        latitude: -23.3963853,
        longitude: -46.3086881,
      },
    })
    // courier coordinates
    // -23.3963853,-46.3086881

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(sutResp.value.orders).toHaveLength(0)
    }
  })

  it('should not be able to fetch nearby orders if the action is not made by an adm or an courier', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())
    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: 'any id',
      courierId: '123',
      requestResponsibleRole: 'recipient',
      coordinates: {
        latitude: -23.3963853,
        longitude: -46.3086881,
      },
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
