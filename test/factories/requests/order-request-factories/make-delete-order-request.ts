import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeDeleteOrderRequestProps {
  orderId: string
  token: string
}

export async function makeDeleteOrderRequest(
  app: INestApplication,
  { orderId, token }: MakeDeleteOrderRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .delete(`/orders/${orderId}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
