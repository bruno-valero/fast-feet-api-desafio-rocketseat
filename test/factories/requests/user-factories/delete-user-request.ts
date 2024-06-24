import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeDeleteUserRequestProps {
  role: UserRoles
  userId: string
  token: string
}

export async function makeDeleteUserRequest(
  app: INestApplication,
  { role, userId, token }: MakeDeleteUserRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .delete(`/users/${role}/${userId}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
