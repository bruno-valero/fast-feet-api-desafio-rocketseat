import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourier } from 'test/factories/entities/makeCourier'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrderIsClosedError } from '@/core/errors/errors/order-errors/order-is-closed-error'
import { makeDeliverOrderUseCase } from 'test/factories/use-cases/order/make-deliver-order-use-case'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAttachment } from 'test/factories/entities/makeAttachment'
import { OrderWasNotCollectedError } from '@/core/errors/errors/order-errors/order-was-not-collected-error'

describe('deliver order use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeDeliverOrderUseCase({
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeDeliverOrderUseCase({
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to deliver an order', async () => {
    await sut.dependencies.couriersRepository.create(makeCourier())

    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.dependencies.admsRepository.create(makeAdm())

    const adm = (await createOrder.dependencies.admsRepository.findMany())[0]

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
    order.actions.adm.admSetAwaitingPickup(adm.id)

    // fake collected
    order.actions.adm.admCollected(adm.id)

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    sut.dependencies.attachmentsRepository.create(
      makeAttachment({}, new UniqueEntityId('att id 1')),
    )

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: courier.id.value,
      attachmentId: 'att id 1',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()
    expect(sutResp.isRight()).toBeTruthy()
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        delivered: expect.any(Date),
      }),
    )
  })

  it('should not be able to deliver an order if the action is not made by a courier', async () => {
    await sut.dependencies.couriersRepository.create(makeCourier())

    // const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.dependencies.admsRepository.create(makeAdm())

    const adm = (await createOrder.dependencies.admsRepository.findMany())[0]

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
    order.actions.adm.admSetAwaitingPickup(adm.id)

    // fake collected
    order.actions.adm.admCollected(adm.id)

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    sut.dependencies.attachmentsRepository.create(
      makeAttachment({}, new UniqueEntityId('att id 1')),
    )

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: 'non courier responsible',
      attachmentId: 'att id 1',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()
    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        delivered: null,
      }),
    )
  })

  it('should not be able to deliver an order if the order is not collected', async () => {
    await sut.dependencies.couriersRepository.create(makeCourier())

    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.dependencies.admsRepository.create(makeAdm())

    const adm = (await createOrder.dependencies.admsRepository.findMany())[0]

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
    order.actions.adm.admSetAwaitingPickup(adm.id)

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    sut.dependencies.attachmentsRepository.create(
      makeAttachment({}, new UniqueEntityId('att id 1')),
    )

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: courier.id.value,
      attachmentId: 'att id 1',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderWasNotCollectedError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
        delivered: null,
      }),
    )
  })

  it('should not be able to deliver a order if the order was returned', async () => {
    await sut.dependencies.couriersRepository.create(makeCourier())

    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.dependencies.admsRepository.create(makeAdm())

    const adm = (await createOrder.dependencies.admsRepository.findMany())[0]

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
    order.actions.adm.admSetAwaitingPickup(adm.id)
    // fake collected
    order.actions.adm.admCollected(adm.id)
    // fake delivery
    order.actions.courier.courierDeliver(order.courierId!)
    // fake return
    order.actions.adm.admReturned('sei la', adm.id)
    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    sut.dependencies.attachmentsRepository.create(
      makeAttachment({}, new UniqueEntityId('att id 1')),
    )

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: courier.id.value,
      attachmentId: 'att id 1',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderIsClosedError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
        collected: expect.any(Date),
        delivered: expect.any(Date),
        returned: expect.any(Date),
      }),
    )
  })

  it('should not be able to deliver a order if the order was already delivered', async () => {
    await sut.dependencies.couriersRepository.create(makeCourier())

    const courier = (await sut.dependencies.couriersRepository.findMany())[0]

    await createOrder.dependencies.admsRepository.create(makeAdm())

    const adm = (await createOrder.dependencies.admsRepository.findMany())[0]

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
    order.actions.adm.admSetAwaitingPickup(adm.id)
    // fake collected
    order.actions.adm.admCollected(adm.id)
    // fake delivery
    order.actions.courier.courierDeliver(order.courierId!)

    // update changes
    createOrder.dependencies.ordersRepository.update(order)

    sut.dependencies.attachmentsRepository.create(
      makeAttachment({}, new UniqueEntityId('att id 1')),
    )

    const sutResp = await sut.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: courier.id.value,
      attachmentId: 'att id 1',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()
    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(OrderIsClosedError)
    expect(orders).toHaveLength(1)
    expect(orders[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId('1188'),
        awaitingPickup: expect.any(Date),
        collected: expect.any(Date),
        delivered: expect.any(Date),
      }),
    )
  })
})
