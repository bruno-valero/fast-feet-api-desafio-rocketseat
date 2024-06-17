import { Coordinates } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { faker } from '@faker-js/faker'

export function makeCoordinates(override?: Partial<Coordinates>) {
  const coordinates = new Coordinates({
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override,
  })

  return coordinates
}
