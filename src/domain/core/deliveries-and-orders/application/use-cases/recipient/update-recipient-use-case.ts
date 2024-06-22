import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { RecipientUpdatesRepository } from '../../repositories/recipient-repositories/recipient-updates-repository'
import { RecipientsRepository } from '../../repositories/recipient-repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

export interface UpdateRecipientUseCaseRequest {
  recipientId: string
  name: string
  cpf: string
  requestResponsibleId: string
}

export type UpdateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class UpdateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private admsRepository: AdmsRepository,
    private recipientUpdatesRepository: RecipientUpdatesRepository,
  ) {}

  async execute({
    recipientId,
    cpf,
    name,
    requestResponsibleId,
  }: UpdateRecipientUseCaseRequest): Promise<UpdateRecipientUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'update_recipient',
      adm.role,
    )
    if (!hasPermission) return left(new UnauthorizedError())

    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) return left(new ResourceNotFoundError())

    const { data: update } = recipient.changeData(
      { cpf, name },
      new UniqueEntityId(requestResponsibleId),
    )
    await this.recipientsRepository.update(recipient)
    await this.recipientUpdatesRepository.create(update)

    return right(null)
  }
}
