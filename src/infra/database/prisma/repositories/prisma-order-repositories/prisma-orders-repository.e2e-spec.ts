import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { StatesShort } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/state'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaAdmMapper } from '@/infra/database/prisma/mappers/prisma-adm-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaOrder, UserRoles } from '@prisma/client'
import { Response } from 'supertest'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeOrder } from 'test/factories/entities/makeOrder'
import { makeMarkOrderAsAwaitingForPickupRequest } from 'test/factories/requests/order-request-factories/make-mark-order-as-awaiting-for-pickup-request'
import { makeAuthenticateRequest } from '../../../../../../test/factories/requests/auth-and-register-factories/make-authenticate-request'
import { makeRegisterRequest } from '../../../../../../test/factories/requests/auth-and-register-factories/make-register-request'
import { makeCreateOrderRequest } from '../../../../../../test/factories/requests/order-request-factories/make-create-order-request'
import { makeFetchOrdersRequest } from '../../../../../../test/factories/requests/order-request-factories/make-fetch-orders-request'

describe('prisma orders repository', () => {
  let app: INestApplication
  let prisma: PrismaService
  let cacheRepository: CacheRepository
  let ordersRepository: OrdersRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CacheModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    cacheRepository = moduleRef.get(CacheRepository)
    ordersRepository = moduleRef.get(OrdersRepository)

    await app.init()
  })

  async function ordersRequestFactory({
    recipientCpf,
    courierCpf,
    admCpf,
    type,
    testNumber,
    ordersLength,
  }: {
    courierCpf: string
    recipientCpf: string
    admCpf: string
    type: UserRoles | 'all'
    testNumber: number
    ordersLength?: number
  }) {
    const encrypter = new BcryptEncrypter()
    await prisma.prismaUser.create({
      data: PrismaAdmMapper.domainToPrisma(
        makeAdm({
          cpf: new Cpf(admCpf),
          password: await encrypter.hash('123'),
        }),
      ),
    })

    const authAdmResp = await makeAuthenticateRequest(app, {
      body: {
        cpf: admCpf,
        password: '123',
        role: 'adm',
      },
    })

    const token = authAdmResp.body.token as string

    expect(authAdmResp.statusCode).toEqual(200)
    expect(token).toEqual(expect.any(String))

    const createRecipientResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: recipientCpf,
        name: 'recipient teste',
        password: '123',
        role: 'recipient',
      },
    })

    expect(createRecipientResp.statusCode).toEqual(201)

    const createCourierResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: courierCpf,
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
    )[testNumber]

    const courier = (
      await prisma.prismaUser.findMany({
        where: {
          role: 'courier',
        },
      })
    )[testNumber]

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

    expect(requests.createOrder1Resp.statusCode).toEqual(201)
    expect(requests.createOrder2Resp.statusCode).toEqual(201)
    expect(requests.createOrder3Resp.statusCode).toEqual(201)
    expect(requests.createOrder4Resp.statusCode).toEqual(201)
    expect(requests.createOrder5Resp.statusCode).toEqual(201)

    let orders: PrismaOrder[] = []

    if (type === 'all') {
      orders = await prisma.prismaOrder.findMany()
    } else if (type === 'courier') {
      orders = await prisma.prismaOrder.findMany({
        where: {
          courierId: courier.id,
        },
      })
    } else {
      orders = await prisma.prismaOrder.findMany({
        where: {
          recipientId: recipient.id,
        },
      })
    }

    const len = ordersLength || 5
    expect(orders).toHaveLength(len)

    return { token, courier, recipient, orders }
  }

  test('it should cache orders', async () => {
    const { token } = await ordersRequestFactory({
      admCpf: '20635940078',
      courierCpf: '04440648002',
      recipientCpf: '24694380044',
      type: 'all',
      testNumber: 0,
    })

    const fetchOrdersResp = await makeFetchOrdersRequest(app, {
      role: 'all',
      token,
    })

    expect(fetchOrdersResp.statusCode).toEqual(200)
    expect(fetchOrdersResp.body.orders).toHaveLength(5)

    const cache = await cacheRepository.get('orders')

    expect(cache).not.toBeNull()
  })
  it('it should cache courier orders', async () => {
    const { token, courier } = await ordersRequestFactory({
      admCpf: '28082324031',
      courierCpf: '25475212023',
      recipientCpf: '97005508009',
      type: 'courier',
      testNumber: 1,
    })

    const fetchOrdersResp = await makeFetchOrdersRequest(app, {
      userId: courier.id,
      role: 'courier',
      token,
    })

    expect(fetchOrdersResp.statusCode).toEqual(200)
    expect(fetchOrdersResp.body.orders).toHaveLength(5)

    const cache = await cacheRepository.get(`orders:${courier.id}`)

    expect(cache).not.toBeNull()
  })

  test('it should cache recipient orders', async () => {
    const { token, recipient } = await ordersRequestFactory({
      admCpf: '86233803047',
      courierCpf: '35320902018',
      recipientCpf: '32162844095',
      type: 'courier',
      testNumber: 2,
    })

    const fetchOrdersResp = await makeFetchOrdersRequest(app, {
      userId: recipient.id,
      role: 'recipient',
      token,
    })

    expect(fetchOrdersResp.statusCode).toEqual(200)
    expect(fetchOrdersResp.body.orders).toHaveLength(5)

    const cache = await cacheRepository.get(`orders:${recipient.id}`)

    expect(cache).not.toBeNull()
  })

  test('it should remove cached orders after update', async () => {
    const { token, orders } = await ordersRequestFactory({
      admCpf: '53909672086',
      courierCpf: '77103243042',
      recipientCpf: '66291159023',
      type: 'all',
      testNumber: 3,
      ordersLength: 20,
    })

    const fetchOrdersResp = await makeFetchOrdersRequest(app, {
      role: 'all',
      token,
    })

    expect(fetchOrdersResp.statusCode).toEqual(200)
    expect(fetchOrdersResp.body.orders).toHaveLength(20)

    const cache = await cacheRepository.get('orders')

    const awaitingResp = await makeMarkOrderAsAwaitingForPickupRequest(app, {
      orderId: orders[0].id,
      token,
    })

    expect(awaitingResp.statusCode).toEqual(204)

    const cacheAfterUpdate = await cacheRepository.get('orders')

    expect(cache).not.toBeNull()
    expect(cacheAfterUpdate).toBeNull()
  })
  it('it should remove cached courier orders after update', async () => {
    const { token, courier, orders } = await ordersRequestFactory({
      admCpf: '15532190070',
      courierCpf: '20894208047',
      recipientCpf: '59740420001',
      type: 'courier',
      testNumber: 4,
      //   ordersLength: 10,
    })

    const fetchOrdersResp = await makeFetchOrdersRequest(app, {
      userId: courier.id,
      role: 'courier',
      token,
    })

    expect(fetchOrdersResp.statusCode).toEqual(200)
    expect(fetchOrdersResp.body.orders).toHaveLength(5)

    const cache = await cacheRepository.get(`orders:${courier.id}`)

    const awaitingResp = await makeMarkOrderAsAwaitingForPickupRequest(app, {
      orderId: orders[0].id,
      token,
    })

    expect(awaitingResp.statusCode).toEqual(204)

    const cacheAfterUpdate = await cacheRepository.get(`orders:${courier.id}`)

    expect(cache).not.toBeNull()
    expect(cacheAfterUpdate).toBeNull()
  })

  test('it should remove cached recipient orders  after update', async () => {
    const { token, recipient, orders } = await ordersRequestFactory({
      admCpf: '97857507016',
      courierCpf: '12436905002',
      recipientCpf: '55294015030',
      type: 'courier',
      testNumber: 5,
      //   ordersLength: 10,
    })

    const fetchOrdersResp = await makeFetchOrdersRequest(app, {
      userId: recipient.id,
      role: 'recipient',
      token,
    })

    expect(fetchOrdersResp.statusCode).toEqual(200)
    expect(fetchOrdersResp.body.orders).toHaveLength(5)

    const cache = await cacheRepository.get(`orders:${recipient.id}`)

    const awaitingResp = await makeMarkOrderAsAwaitingForPickupRequest(app, {
      orderId: orders[0].id,
      token,
    })

    expect(awaitingResp.statusCode).toEqual(204)

    const cacheAfterUpdate = await cacheRepository.get(`orders:${recipient.id}`)

    expect(cache).not.toBeNull()
    expect(cacheAfterUpdate).toBeNull()
  })

  it('should return cached data on subsequent calls', async () => {
    const order = makeOrder({ courierId: new UniqueEntityId('oi') }).toJson()

    await cacheRepository.set(`orders`, `[${order}]`)
    const data = await ordersRepository.findMany()

    expect(data[0].courierId?.value).toEqual('oi')
  })

  it('should return cached courier data on subsequent calls', async () => {
    const order = makeOrder({ courierId: new UniqueEntityId('oi') }).toJson()
    await cacheRepository.set(`orders:courier1`, `[${order}]`)
    const data = await ordersRepository.findManyByCourierId('courier1')

    expect(data[0].courierId?.value).toEqual('oi')
  })

  it('should return cached recipient data on subsequent calls', async () => {
    const order = makeOrder({ courierId: new UniqueEntityId('oi') }).toJson()
    await cacheRepository.set(`orders:recipient1`, `[${order}]`)
    const data = await ordersRepository.findManyByRecipientId('recipient1')

    expect(data[0].courierId?.value).toEqual('oi')
  })
})
