import UniqueEntityId from '@/core/entities/unique-entity-id'
import Entity from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'

export interface AttachmentProps {
  title: string
  url: string
  orderId: UniqueEntityId | null
}

export type AttachmentCreateProps = Optional<AttachmentProps, 'orderId'>

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentCreateProps, id?: UniqueEntityId) {
    return new Attachment(
      {
        ...props,
        orderId: props.orderId ?? null,
      },
      id,
    )
  }
}
