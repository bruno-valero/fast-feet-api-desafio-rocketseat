import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeFetchCourierOrdersUseCase } from 'test/factories/use-cases/order/make-fetch-courier-orders-use-case'
import { makeCourier } from 'test/factories/entities/makeCourier'

describe('fetch recipient orders use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeFetchCourierOrdersUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeFetchCourierOrdersUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to fetch a courier orders', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await sut.dependencies.couriersRepository.create(
      makeCourier({}, new UniqueEntityId('1188')),
    )

    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })
    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })

    const sutResp = await sut.useCase.execute({
      courierId: '123',
      requestResponsibleRole: 'courier',
      requestResponsibleId: '1188',
    })

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(sutResp.value.orders).toHaveLength(2)
    }
  })

  it('should not be able to fetch courier orders if the action is not made by the courier or an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await sut.dependencies.couriersRepository.create(
      makeCourier({}, new UniqueEntityId('1188')),
    )

    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('other recipient'),
      },
    })
    await createOrder.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })

    const sutResp = await sut.useCase.execute({
      courierId: '123',
      requestResponsibleRole: 'recipient',
      requestResponsibleId: '1188',
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
