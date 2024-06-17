import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeMarkOrderAsAwaitingForPickupUseCase } from 'test/factories/use-cases/order/make-mark-order-as-awaiting-for-pickup-use-case'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrderAwaitingPickupError } from '@/core/errors/errors/order-errors/order-awaiting-for-pickup-error'

describe('mark order as awaiting for pickup use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeMarkOrderAsAwaitingForPickupUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeMarkOrderAsAwaitingForPickupUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to mark a order as awaiting for pickup', async () => {
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

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
      }),
    )
  })

  it('should not be able to mark order as awaiting for pickup if the action is not made by an adm', async () => {
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
    })

    const orders = await sut.dependencies.ordersRepository.findMany()
    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: null,
      }),
    )
  })

  it('should not be able to mark order as awaiting for pickup if the order is already marked for pickup', async () => {
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

    // fake awaiting for pickup
    order.actions.adm.admSetAwaitingPickup()

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderAwaitingPickupError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
      }),
    )
  })

  it('should not be able to mark order as awaiting for pickup if the order was returned', async () => {
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
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderAwaitingPickupError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
      }),
    )
  })

  it('should not be able to mark order as awaiting for pickup if the order was delivered', async () => {
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
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderAwaitingPickupError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
      }),
    )
  })
})
