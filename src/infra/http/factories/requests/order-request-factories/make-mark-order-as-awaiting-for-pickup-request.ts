import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeMarkOrderAsAwaitingForPickupRequestProps {
  orderId: string
  token: string
}

export async function makeMarkOrderAsAwaitingForPickupRequest(
  app: INestApplication,
  { token, orderId }: MakeMarkOrderAsAwaitingForPickupRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/orders/${orderId}/awaiting`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
