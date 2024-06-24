import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeAuthenticateRequestProps {
  body: {
    cpf: string
    password: string
    role: UserRoles
  }
}

export async function makeAuthenticateRequest(
  app: INestApplication,
  { body }: MakeAuthenticateRequestProps,
) {
  const resp = await request(app.getHttpServer()).post(`/sessions`).send(body)

  return resp
}
