import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import { Coordinates } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/coordinates'
import { Cpf } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'

export function makeRecipient(
  override?: Partial<Recipient>,
  id?: UniqueEntityId,
) {
  const result = Recipient.create(
    {
      coordinates: new Coordinates({
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      }),
      cpf: new Cpf(
        String(faker.number.int({ min: 10000000000, max: 99999999999 })),
      ),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return result
}
