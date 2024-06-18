import { Recipient } from '../../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract update(recipient: Recipient): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByCpf(cpf: string): Promise<Recipient | null>
  abstract findMany(): Promise<Recipient[]>
}
