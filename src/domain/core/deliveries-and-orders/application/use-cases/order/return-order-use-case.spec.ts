import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { makeReturnOrderUseCase } from 'test/factories/use-cases/order/make-return-order-use-case'
import { OrderNotDeliveredError } from '@/core/errors/errors/order-errors/order-not-delivered-error'
import { OrderAlreadyReturnedError } from '@/core/errors/errors/order-errors/order-already-returned-error copy'
import { OrderWasNotCollectedError } from '@/core/errors/errors/order-errors/order-was-not-collected-error'

describe('return order use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeReturnOrderUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeReturnOrderUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to return a order', async () => {
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

    const order = (
      await createOrder.dependencies.ordersRepository.findMany()
    )[0]

    // fake awaiting for pickup
    order.actions.adm.admSetAwaitingPickup()
    // fake collected
    order.actions.adm.admCollected()
    // fake delivery
    order.actions.courier.courierDeliver()
    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
      returnCause: 'nao sei',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()
    expect(sutResp.isRight()).toBeTruthy()
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        returned: expect.any(Date),
        returnCause: 'nao sei',
      }),
    )
  })

  it('should not be able to return a order if the action is not made by an adm', async () => {
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
      requestResponsibleId: 'non adm responsible',
      returnCause: 'nao sei',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()
    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        returned: null,
        returnCause: null,
      }),
    )
  })

  it('should not be able to return a order if the order was not delivered yet', async () => {
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

    const order = (
      await createOrder.dependencies.ordersRepository.findMany()
    )[0]

    // fake awaiting for pickup
    order.actions.adm.admSetAwaitingPickup()
    // fake collected
    order.actions.adm.admCollected()

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
      returnCause: 'nao sei',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderNotDeliveredError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        returned: null,
        returnCause: null,
      }),
    )
  })
  it('should not be able to return a order if the order was already been returned', async () => {
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

    const order = (
      await createOrder.dependencies.ordersRepository.findMany()
    )[0]

    // fake awaiting for pickup
    order.actions.adm.admSetAwaitingPickup()
    // fake collected
    order.actions.adm.admCollected()
    // fake delivery
    order.actions.courier.courierDeliver()
    // fake return
    order.actions.adm.admReturned()

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
      returnCause: 'nao sei',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderAlreadyReturnedError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        returned: expect.any(Date),
      }),
    )
  })

  it('should not be able to return a order if the order it was not collected', async () => {
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

    const order = (
      await createOrder.dependencies.ordersRepository.findMany()
    )[0]

    // fake awaiting for pickup
    order.actions.adm.admSetAwaitingPickup()

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
      returnCause: 'nao sei',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderWasNotCollectedError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        returned: null,
      }),
    )
  })
})
