import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

export function makeAttachment(
  override?: Partial<Attachment>,
  id?: UniqueEntityId,
) {
  const result = Attachment.create(
    {
      title: faker.lorem.sentence(4),
      url: randomUUID(),
      ...override,
    },
    id,
  )

  return result
}
