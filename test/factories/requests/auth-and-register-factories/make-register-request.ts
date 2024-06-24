import { INestApplication } from '@nestjs/common'
import { UserRoles } from '@prisma/client'
import request from 'supertest'

export interface MakeRegisterRequestProps {
  body: {
    cpf: string
    name: string
    password: string
    role: UserRoles
  }
  token: string
}

export async function makeRegisterRequest(
  app: INestApplication,
  { token, body }: MakeRegisterRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .post(`/register`)
    .set('Authorization', `Bearer ${token}`)
    .send(body)

  return resp
}
