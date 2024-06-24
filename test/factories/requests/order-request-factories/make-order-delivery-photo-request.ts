import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeMakeOrderDeliveryPhotoRequestProps {
  token: string
}

export async function makeMakeOrderDeliveryPhotoRequest(
  app: INestApplication,
  { token }: MakeMakeOrderDeliveryPhotoRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .post(`/orders/deliver/photo-upload`)
    .set('Authorization', `Bearer ${token}`)
    .attach('file', './test/e2e/sample-upload.png')

  return resp
}
