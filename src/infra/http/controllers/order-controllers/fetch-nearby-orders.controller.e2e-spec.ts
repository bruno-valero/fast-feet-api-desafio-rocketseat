import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { StatesShort } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/state'
import { AppModule } from '@/infra/app.module'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter'
import { PrismaAdmMapper } from '@/infra/database/prisma/mappers/prisma-adm-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Response } from 'supertest'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateRequest } from '../../../../../test/factories/requests/auth-and-register-factories/make-authenticate-request'
import { makeRegisterRequest } from '../../../../../test/factories/requests/auth-and-register-factories/make-register-request'
import { makeCreateOrderRequest } from '../../../../../test/factories/requests/order-request-factories/make-create-order-request'
import { makeFetchNearbyOrdersRequest } from '../../../../../test/factories/requests/order-request-factories/make-fetch-nearby-orders-request'

describe('fetch nearby orders controller', () => {
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

  test('GET /orders/:courierId/nearby', async () => {
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

    const currentCoordinates = {
      latitude: -23.3963853,
      longitude: -46.3086881,
    }

    const nearbyCoordinates = {
      latitude: -23.3798813,
      longitude: -46.2576877,
    }
    const farAwayCoordinates = {
      latitude: -23.3571925,
      longitude: -46.2076257,
    }

    const nearbyAddress = {
      cep: '00447590',
      street: 'rua dos bobos',
      number: 'numero zero',
      city: 'nao tinha cidade',
      neighborhood: 'nao tinha bairro',
      state: 'SP' as StatesShort,
      coordinates: nearbyCoordinates,
    }

    const farAwayAddress = {
      cep: '00447590',
      street: 'rua dos bobos',
      number: 'numero zero',
      city: 'nao tinha cidade',
      neighborhood: 'nao tinha bairro',
      state: 'SP' as StatesShort,
      coordinates: farAwayCoordinates,
    }

    const requests: Record<string, Response> = {}

    for (let i = 1; i <= 5; i++) {
      requests[`createOrder${i}Resp`] = await makeCreateOrderRequest(app, {
        token,
        body: {
          address: i <= 2 ? nearbyAddress : farAwayAddress, // 2 nearby and 3 far away orders
          courierId: courier.id,
          recipientId: recipient.id,
        },
      })
    }

    const orders = await prisma.prismaOrder.findMany()
    expect(orders).toHaveLength(5)

    const fetchNearbyOrdersResp = await makeFetchNearbyOrdersRequest(app, {
      courierId: courier.id,
      coordinates: currentCoordinates,
      token,
    })

    expect(requests.createOrder1Resp.statusCode).toEqual(201)
    expect(requests.createOrder2Resp.statusCode).toEqual(201)
    expect(requests.createOrder3Resp.statusCode).toEqual(201)
    expect(requests.createOrder4Resp.statusCode).toEqual(201)
    expect(requests.createOrder5Resp.statusCode).toEqual(201)

    expect(fetchNearbyOrdersResp.statusCode).toEqual(200)
    expect(fetchNearbyOrdersResp.body.orders).toHaveLength(2)
  })
})
