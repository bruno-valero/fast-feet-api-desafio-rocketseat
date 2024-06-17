import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeFindOrderUseCase } from 'test/factories/use-cases/order/make-find-order-use-case'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'

describe('find order use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeFindOrderUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeFindOrderUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to find a order', async () => {
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

    const order = (await sut.dependencies.ordersRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(sutResp.value.order.recipientId).toEqual(
        new UniqueEntityId('1188'),
      )
      expect(orders).toHaveLength(1)
    }
  })

  it('should not be able to find a order if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    await createOrder.useCase.execute({
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
      requestResponsibleId: adm.id.value,
    })

    const order = (await sut.dependencies.ordersRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: 'any Id',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(orders).toHaveLength(1)
  })
})
