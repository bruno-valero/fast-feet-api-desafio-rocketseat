import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeFetchOrdersUseCase } from 'test/factories/use-cases/order/make-fetch-orders-use-case'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import UniqueEntityId from '@/core/entities/unique-entity-id'

describe('fetch couriers use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeFetchOrdersUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeFetchOrdersUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to fetch couriers', async () => {
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
      requestResponsibleId: adm.id.value,
    })

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(sutResp.value.orders).toHaveLength(1)
      expect(sutResp.value.orders[0]).toEqual(
        expect.objectContaining({
          courierId: new UniqueEntityId('123'),
          recipientId: new UniqueEntityId('1188'),
        }),
      )
    }
  })

  it('should not be able to fetch couriers if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    // const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createOrder.useCase.execute({
      requestResponsibleId: 'other user',
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: 'any Id',
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
