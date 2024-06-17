import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import UniqueEntityId from '@/core/entities/unique-entity-id'

describe('create order use case', () => {
  let sut = makeCreateOrderUseCase()

  beforeEach(() => {
    sut = makeCreateOrderUseCase()
  })

  it('should be able to create a order', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: adm.id.value,
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })

    const orders = await sut.dependencies.ordersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    if (sutResp.isRight()) {
      expect(orders).toHaveLength(1)
    }
  })

  it('should not be able to create a order if the action is not made by an adm', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    // const adm = (await sut.dependencies.admsRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      requestResponsibleId: 'other user',
      creationProps: {
        address: makeAddress(),
        courierId: new UniqueEntityId('123'),
        recipientId: new UniqueEntityId('1188'),
      },
    })

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
