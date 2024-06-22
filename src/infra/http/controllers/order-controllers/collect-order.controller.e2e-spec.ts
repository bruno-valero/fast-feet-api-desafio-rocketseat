import { AppModule } from '@/infra/app.module'
import { PrismaAdmMapper } from '@/infra/database/prisma/mappers/prisma-adm-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateRequest } from '../../factories/requests/auth-and-register-factories/make-authenticate-request'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { makeRegisterRequest } from '../../factories/requests/auth-and-register-factories/make-register-request'
import { makeCreateOrderRequest } from '../../factories/requests/order-request-factories/make-create-order-request'
import { makeCollectOrderRequest } from '../../factories/requests/order-request-factories/make-collect-order-request'

describe('collect order controller', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('PATCH /orders/:id/collect', async () => {
    await prisma.prismaUser.create({
      data: PrismaAdmMapper.domainToPrisma(
        makeAdm({
          cpf: new Cpf('20635940078'),
          password: '123',
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

    const createRecipientResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: '66967772023',
        name: 'recipient teste',
        password: '123',
        role: 'recipient',
      },
    })

    const createCourierResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: '29241359072',
        name: 'courier teste',
        password: '123',
        role: 'courier',
      },
    })

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
          cep: '004475900',
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

    const order = (await prisma.prismaOrder.findMany())[0]

    const collectOrderResp = await makeCollectOrderRequest(app, {
      orderId: order.id,
      token,
    })

    const orderUpdated = (await prisma.prismaOrder.findMany())[0]

    expect(authAdmResp.statusCode).toEqual(200)
    expect(createRecipientResp.statusCode).toEqual(201)
    expect(createCourierResp.statusCode).toEqual(201)
    expect(createOrderResp.statusCode).toEqual(201)
    expect(collectOrderResp.statusCode).toEqual(204)
    expect(orderUpdated.collected).toEqual(expect.any(Date))
  })
})
