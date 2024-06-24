import { DomainEvents } from '@/core/events/domain-events'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter'
import { PrismaAdmMapper } from '@/infra/database/prisma/mappers/prisma-adm-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterRequest } from 'test/factories/requests/auth-and-register-factories/make-register-request'
import { makeUpdateUserPasswordRequest } from 'test/factories/requests/user-factories/update-user-password-request'
import { makeAuthenticateRequest } from '../../../../../test/factories/requests/auth-and-register-factories/make-authenticate-request'

describe('update user password controller', () => {
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

  test('PATCH /users/:role/:id/update-password', async () => {
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

    const createCourierResp = await makeRegisterRequest(app, {
      token,
      body: {
        cpf: '29241359072',
        name: 'courier teste',
        password: '123',
        role: 'courier',
      },
    })

    const courier = (
      await prisma.prismaUser.findMany({
        where: {
          role: 'courier',
        },
      })
    )[0]

    expect(createRecipientResp.statusCode).toEqual(201)
    expect(createCourierResp.statusCode).toEqual(201)

    const updatePasswordResp = await makeUpdateUserPasswordRequest(app, {
      role: 'courier',
      token,
      userId: courier.id,
      body: {
        password: '8799',
      },
    })

    const courierUpdated = (
      await prisma.prismaUser.findMany({
        where: {
          role: 'courier',
        },
      })
    )[0]

    expect(updatePasswordResp.statusCode).toEqual(204)
    expect(encrypter.compare('8799', courierUpdated.password))
  })
})