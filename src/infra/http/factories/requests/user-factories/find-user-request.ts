import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeFindUserRequestProps {
  role: UserRoles
  userId: string
  token: string
}

export async function makeFindUserRequest(
  app: INestApplication,
  { role, userId, token }: MakeFindUserRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .get(`/user/${role}/${userId}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
