import UniqueEntityId from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeDeleteOrderUseCase } from 'test/factories/use-cases/order/make-delete-order-use-case'

describe('delete order use case', () => {
  let createOrder = makeCreateOrderUseCase()
  let sut = makeDeleteOrderUseCase({
    admsRepositoryAlt: createOrder.dependencies.admsRepository,
    ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
  })
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    sut = makeDeleteOrderUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
  })

  it('should be able to delete a order', async () => {
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
    expect(orders).toHaveLength(0)
  })

  it('should not be able to delete a order if the action is not made by an adm', async () => {
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
      requestResponsibleId: 'any Id',
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(orders).toHaveLength(1)
  })
})
