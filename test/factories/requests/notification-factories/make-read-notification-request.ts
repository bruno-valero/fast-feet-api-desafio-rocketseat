import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeReadNotificationRequestProps {
  notificationId: string
  token: string
}

export async function makeReadNotificationRequest(
  app: INestApplication,
  { notificationId, token }: MakeReadNotificationRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .patch(`/notifications/${notificationId}/read`)
    .set('Authorization', `Bearer ${token}`)

  return resp
}
