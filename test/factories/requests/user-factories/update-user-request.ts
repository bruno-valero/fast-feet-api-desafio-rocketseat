import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeUpdateUserRequestProps {
  role: UserRoles
  userId: string
  body: {
    cpf: string
    name: string
  }
  token: string
}

export async function makeUpdateUserRequest(
  app: INestApplication,
  { role, userId, token, body }: MakeUpdateUserRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .put(`/users/${role}/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(body)

  return resp
}
