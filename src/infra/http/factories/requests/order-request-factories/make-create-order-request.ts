import { AddressCreationProps } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/address'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeCreateOrderRequestProps {
  body: {
    address: AddressCreationProps
    courierId: string
    recipientId: string
  }
  token: string
}

export async function makeCreateOrderRequest(
  app: INestApplication,
  { body, token }: MakeCreateOrderRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .post(`/orders/`)
    .set('Authorization', `Bearer ${token}`)
    .send(body)

  return resp
}
