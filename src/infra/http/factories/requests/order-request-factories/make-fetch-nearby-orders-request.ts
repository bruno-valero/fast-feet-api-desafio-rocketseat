import { Coordinates } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export interface MakeFetchNearbyOrdersRequestProps {
  courierId: string
  coordinates: Coordinates['raw']
  token: string
}

export async function makeFetchNearbyOrdersRequest(
  app: INestApplication,
  {
    courierId,
    token,
    coordinates: { latitude, longitude },
  }: MakeFetchNearbyOrdersRequestProps,
) {
  const resp = await request(app.getHttpServer())
    .get(
      `/orders/${courierId}/nearby?latitude=${latitude}&longitude=${longitude}`,
    )
    .set('Authorization', `Bearer ${token}`)

  return resp
}
