import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { RecipientsRepository } from '../../repositories/recipient-repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

export interface DeleteRecipientUseCaseRequest {
  requestResponsibleId: string
  recipientId: string
}

export type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_recipient', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) return left(new ResourceNotFoundError())

    await this.recipientsRepository.delete(recipientId)

    return right(null)
  }
}
