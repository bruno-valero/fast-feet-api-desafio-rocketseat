import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeUpdateUserPasswordRequestProps {
  role: UserRoles
  userId: string
  body: {
    password: string
  }
  token: string
}

export async function makeUpdateUserPasswordRequest(
  app: INestApplication,
  { role, userId, token, body }: MakeUpdateUserPasswordRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/users/${role}/${userId}/update-password`)
    .set('Authorization', `Bearer ${token}`)
    .send(body)

  return resp
}
