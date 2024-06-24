import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaAdmMapper } from '@/infra/database/prisma/mappers/prisma-adm-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeAuthenticateRequest } from '../../../../../test/factories/requests/auth-and-register-factories/make-authenticate-request'
import { makeMakeOrderDeliveryPhotoRequest } from '../../../../../test/factories/requests/order-request-factories/make-order-delivery-photo-request'

describe('Upload delivered photo attachment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /orders/deliver/photo-upload', async () => {
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

    const response = await makeMakeOrderDeliveryPhotoRequest(app, { token })

    expect(response.statusCode).toEqual(201)
    expect(response.body.attachment).toEqual(expect.any(String))
  })
})
