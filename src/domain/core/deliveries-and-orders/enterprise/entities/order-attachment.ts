import UniqueEntityId from '@/core/entities/unique-entity-id'
import Entity from '@/core/entities/entity'
import z from 'zod'

// eslint-disable-next-line
export const orderAttachmentInstanceSchema = z.custom<OrderAttachment>(
  (data) => data instanceof OrderAttachment,
  'must be a valide OrderAttachment',
)

export interface OrderAttachmentProps {
  orderId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export type OrderAttachmentCreateProps = OrderAttachmentProps

export type OrderAttachmentRaw = {
  orderId: string
  attachmentId: string
}

export class OrderAttachment extends Entity<OrderAttachmentProps> {
  static create(props: OrderAttachmentCreateProps, id?: UniqueEntityId) {
    return new OrderAttachment(
      {
        ...props,
      },
      id,
    )
  }

  get orderId() {
    return this.props.orderId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  get raw() {
    return <OrderAttachmentRaw>{
      orderId: this.orderId.value,
      attachmentId: this.attachmentId.value,
    }
  }
}
