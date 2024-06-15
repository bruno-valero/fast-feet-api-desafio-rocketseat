import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export type UpdateObjectTypes = 'order' | 'courier' | 'recipient' | 'adm'

type ToJson = { toJson(spacing?: number): string }

export interface UpdateProps<ObjectInstance extends ToJson> {
  objectId: UniqueEntityId
  updatedBy: UniqueEntityId
  date: Date
  changes: {
    before: ObjectInstance
    after: ObjectInstance
  }
  objectType: UpdateObjectTypes
}

export type UpdateToJson = {
  changes: {
    before: string
    after: string
  }
  date: string
  objectId: string
  objectType: string
  updatedBy: string
}

export abstract class Update<
  ObjectInstance extends ToJson,
  props extends UpdateProps<ObjectInstance>,
> extends Entity<props> {
  toJson(spacing?: number) {
    const data: UpdateToJson = {
      changes: {
        before: this.props.changes.before.toJson(),
        after: this.props.changes.after.toJson(),
      },
      date: this.props.date.toISOString(),
      objectId: this.props.objectId.value,
      objectType: this.props.objectType,
      updatedBy: this.props.updatedBy.value,
    }

    return JSON.stringify(data, null, spacing)
  }

  parseFromJson(json: string) {
    const data = JSON.parse(json) as UpdateToJson

    return data
  }

  get objectId() {
    return this.props.objectId
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  get date() {
    return this.props.date
  }

  get changes() {
    return this.props.changes
  }

  get objectType() {
    return this.props.objectType
  }
}
