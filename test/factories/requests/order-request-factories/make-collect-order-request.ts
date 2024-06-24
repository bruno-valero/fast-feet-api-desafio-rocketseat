import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeCollectOrderRequestProps {
  orderId: string
  token: string
}

export async function makeCollectOrderRequest(
  app: INestApplication,
  { orderId, token }: MakeCollectOrderRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/orders/${orderId}/collect`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
