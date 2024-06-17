import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { RecipientUpdatesRepository } from '../../repositories/recipient-repositories/recipient-updates-repository'
import { Encrypter } from '../../cryptography/encrypter'
import { RecipientsRepository } from '../../repositories/recipient-repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

export interface UpdateRecipientPasswordUseCaseRequest {
  recipientId: string
  password: string
  requestResponsibleId: string
}

export type UpdateRecipientPasswordUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class UpdateRecipientPasswordUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private admsRepository: AdmsRepository,
    private recipientUpdatesRepository: RecipientUpdatesRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    recipientId,
    password,
    requestResponsibleId,
  }: UpdateRecipientPasswordUseCaseRequest): Promise<UpdateRecipientPasswordUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'update_recipient',
      adm.role,
    )
    if (!hasPermission) return left(new UnauthorizedError())

    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) return left(new ResourceNotFoundError())

    const passwordHash = await this.encrypter.hash(password)

    const { data: update } = recipient.changePassword(
      passwordHash,
      new UniqueEntityId(requestResponsibleId),
    )
    await this.recipientsRepository.update(recipient)
    await this.recipientUpdatesRepository.create(update)

    return right(null)
  }
}
