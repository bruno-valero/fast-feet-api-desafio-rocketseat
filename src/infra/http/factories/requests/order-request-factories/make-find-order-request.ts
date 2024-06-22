import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeFindOrdersRequestProps {
  orderId: string
  token: string
}

export async function makeFindOrdersRequest(
  app: INestApplication,
  { token, orderId }: MakeFindOrdersRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .get(`/orders/${orderId}/find`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
