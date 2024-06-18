import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OnOrderCourierDeliver } from '@/domain/generic/notification/application/subscribers/on-order-courier-deliver'
import {
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '@/domain/generic/notification/application/use-cases/send-notification'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAddress } from 'test/factories/entities/value-objects/makeAddress'
import { makeSendNotificationUseCase } from 'test/factories/use-cases/notification/make-send-notification-use-case'
import { makeCreateOrderUseCase } from 'test/factories/use-cases/order/make-create-order-use-case'
import { makeMarkOrderAsAwaitingForPickupUseCase } from 'test/factories/use-cases/order/make-mark-order-as-awaiting-for-pickup-use-case'
import { waitFor } from 'test/lib/await-for'
import { MockInstance } from 'vitest'

let createOrder = makeCreateOrderUseCase()
let awaitingPickup = makeMarkOrderAsAwaitingForPickupUseCase({
  admsRepositoryAlt: createOrder.dependencies.admsRepository,
  ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
})
let createNotification = makeSendNotificationUseCase()
let sut: OnOrderCourierDeliver // eslint-disable-line

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on courier collect order', () => {
  beforeEach(() => {
    createOrder = makeCreateOrderUseCase()
    awaitingPickup = makeMarkOrderAsAwaitingForPickupUseCase({
      admsRepositoryAlt: createOrder.dependencies.admsRepository,
      ordersRepositoryAlt: createOrder.dependencies.ordersRepository,
    })
    createNotification = makeSendNotificationUseCase()

    sut = new OnOrderCourierDeliver(
      createOrder.dependencies.ordersRepository,
      createNotification.useCase,
    )
    sendNotificationSpy = vi.spyOn(createNotification.useCase, 'execute')
  })

  afterAll(() => {})

  it('shoud be able to send a notification on courier collect order', async () => {
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

    order.actions.adm.admSetAwaitingPickup(adm.id)
    order.actions.adm.admCollected(adm.id)
    order.actions.courier.courierDeliver(new UniqueEntityId('123'))

    await createOrder.dependencies.ordersRepository.update(order)

    await awaitingPickup.useCase.execute({
      orderId: order.id.value,
      requestResponsibleId: adm.id.value,
    })

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
