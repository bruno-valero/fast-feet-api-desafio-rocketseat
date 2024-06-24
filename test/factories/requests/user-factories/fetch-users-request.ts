import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeFetchUsersRequestProps {
  role: UserRoles
  token: string
}

export async function makeFetchUsersRequest(
  app: INestApplication,
  { role, token }: MakeFetchUsersRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .get(`/users/${role}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
