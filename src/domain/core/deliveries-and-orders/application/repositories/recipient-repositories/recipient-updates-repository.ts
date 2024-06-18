import { UpdateRecipient } from '../../../enterprise/entities/update-recipient'

export abstract class RecipientUpdatesRepository {
  abstract create(update: UpdateRecipient): Promise<void>
  abstract update(update: UpdateRecipient): Promise<void>
  abstract findById(id: string): Promise<UpdateRecipient | null>
  abstract findMany(): Promise<UpdateRecipient[]>
}
