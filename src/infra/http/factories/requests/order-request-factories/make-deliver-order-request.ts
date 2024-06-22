import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeDeliverOrderRequestProps {
  orderId: string
  attachmentId: string
  token: string
}

export async function makeDeliverOrderRequest(
  app: INestApplication,
  { orderId, attachmentId, token }: MakeDeliverOrderRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/orders/${orderId}/deliver?attachmentId=${attachmentId}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
