import { UserRoles } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeFetchOrdersRequestProps {
  role: UserRoles | 'all'
  userId?: string
  token: string
}

export async function makeFetchOrdersRequest(
  app: INestApplication,
  { role, token, userId }: MakeFetchOrdersRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .get(`/orders/${role}/${userId ? '?userId=' + userId : ''}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
