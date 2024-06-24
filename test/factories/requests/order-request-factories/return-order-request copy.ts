import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeReturnOrderRequestProps {
  orderId: string
  token: string
  returnCause: string
}

export async function makeReturnOrderRequest(
  app: INestApplication,
  { token, orderId, returnCause }: MakeReturnOrderRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/orders/${orderId}/return?returnCause=${returnCause}`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
