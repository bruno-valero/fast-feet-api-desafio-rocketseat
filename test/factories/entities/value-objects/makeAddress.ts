import { Address } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/address'
import { makeCoordinates } from './makeCoordinates'
import { faker } from '@faker-js/faker'
import { StatesShort } from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/state'

const statesShort: StatesShort[] = [
  'AM',
  'PA',
  'RR',
  'AP',
  'AC',
  'RO',
  'TO',
  'MA',
  'PI',
  'CE',
  'RN',
  'PB',
  'PE',
  'AL',
  'SE',
  'BA',
  'MG',
  'ES',
  'RJ',
  'SP',
  'PR',
  'SC',
  'RS',
  'MS',
  'MT',
  'GO',
  'DF',
]

export function makeAddress(override?: Partial<Address>) {
  const address = new Address({
    coordinates: makeCoordinates(override?.coordinates).raw,
    city: faker.location.city(),
    neighborhood: faker.lorem.sentence(2),
    number: faker.lorem.sentence(1),
    street: faker.location.street(),
    ...override,
    cep:
      override?.cep?.raw ??
      String(faker.number.int({ min: 10000000, max: 99999999 })),
    state:
      override?.state?.short ??
      statesShort[Math.floor(Math.random() * statesShort.length)],
  })

  return address
}
