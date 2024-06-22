import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeReturnOrderRequestProps {
  orderId: string
  token: string
}

export async function makeReturnOrderRequest(
  app: INestApplication,
  { token, orderId }: MakeReturnOrderRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/orders/${orderId}/return`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
