import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  createdAt: Date
  readAt?: Date | null
}

export type NotificationCreateProps = Omit<
  Optional<NotificationProps, 'createdAt'>,
  'recipientId'
> & {
  recipientId: string
}

export class Notification extends Entity<NotificationProps> {
  static create(props: NotificationCreateProps, id?: UniqueEntityId) {
    return new Notification(
      {
        ...props,
        recipientId: new UniqueEntityId(props.recipientId),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt(): Date | null | undefined {
    return this.props.readAt
  }

  read() {
    this.props.readAt = new Date()
  }
}
