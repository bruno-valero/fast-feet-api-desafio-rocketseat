import { randomUUID } from 'node:crypto'

export default class UniqueEntityId {
  private _value: string

  constructor(id?: string) {
    this._value = id ?? randomUUID()
  }

  get value() {
    return this._value
  }

  public equals(id: UniqueEntityId) {
    return id.value === this.value
  }
}
