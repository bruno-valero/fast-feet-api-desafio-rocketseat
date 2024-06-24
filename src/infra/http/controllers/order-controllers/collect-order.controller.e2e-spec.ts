import { AppModule } from '@/infra/app.module'
import { PrismaAdmMapper } from '@/infra/database/prisma/mappers/prisma-adm-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateRequest } from '../../../../../test/factories/requests/auth-and-register-factories/make-authenticate-request'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { makeRegisterRequest } from '../../../../../test/factories/requests/auth-and-register-factories/make-register-request'
import { makeCreateOrderRequest } from '../../../../../test/factories/requests/order-request-factories/make-create-order-request'
import { makeCollectOrderRequest } from '../../../../../test/factories/requests/order-request-factories/make-collect-order-request'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter'
import { makeMarkOrderAsAwaitingForPickupRequest } from '../../../../../test/factories/requests/order-request-factories/make-mark-order-as-awaiting-for-pickup-request'
import { waitFor } from 'test/lib/await-for'
import { DomainEvents } from '@/core/events/domain-events'

describe('collect order controller', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  test('PATCH /orders/:id/collect', async () => {
    const encrypter = new BcryptEncrypter()
    await prisma.prismaUser.create({
      data: PrismaAdmMapper.domainToPrisma(
        makeAdm({
          cpf: new Cpf('20635940078'),
          password: await encrypter.hash('123'),
        }),
      ),
    })

    const authAdmResp = await makeAuthenticateRequest(app, {
      body: {
        cpf: '20635940078',
        password: '123',
        role: 'adm',
      },
    })

    const token = authAdmResp.body.token

    expect(authAdmResp.statusCode).toEqual(200)
    expect(token).toEqual(expect.any(String))

    const createRecipientResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: '66967772023',
        name: 'recipient teste',
        password: '123',
        role: 'recipient',
      },
    })

    expect(createRecipientResp.statusCode).toEqual(201)

    const createCourierResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: '29241359072',
        name: 'courier teste',
        password: '123',
        role: 'courier',
      },
    })

    expect(createCourierResp.statusCode).toEqual(201)

    const recipient = (
      await prisma.prismaUser.findMany({
        where: {
          role: 'recipient',
        },
      })
    )[0]

    const courier = (
      await prisma.prismaUser.findMany({
        where: {
          role: 'courier',
        },
      })
    )[0]

    const createOrderResp = await makeCreateOrderRequest(app, {
      token,
      body: {
        address: {
          cep: '00447590',
          street: 'rua dos bobos',
          number: 'numero zero',
          city: 'nao tinha cidade',
          neighborhood: 'nao tinha bairro',
          state: 'SP',
          coordinates: {
            latitude: 1,
            longitude: 1,
          },
        },
        courierId: courier.id,
        recipientId: recipient.id,
      },
    })

    expect(createOrderResp.statusCode).toEqual(201)

    const order = (await prisma.prismaOrder.findMany())[0]

    const awaitingOrderPickupResp =
      await makeMarkOrderAsAwaitingForPickupRequest(app, {
        orderId: order.id,
        token,
      })

    expect(awaitingOrderPickupResp.statusCode).toEqual(204)

    const collectOrderResp = await makeCollectOrderRequest(app, {
      orderId: order.id,
      token,
    })

    const orderUpdated = (await prisma.prismaOrder.findMany())[0]

    expect(collectOrderResp.statusCode).toEqual(204)
    expect(orderUpdated.collected).toEqual(expect.any(Date))

    await waitFor(async () => {
      const notifications = await prisma.prismaNotification.findMany()
      expect(notifications).toHaveLength(2)
    })
  })
})
