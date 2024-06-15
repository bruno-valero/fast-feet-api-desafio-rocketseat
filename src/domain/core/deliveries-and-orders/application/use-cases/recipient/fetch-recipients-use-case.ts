import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Recipient } from '../../../enterprise/entities/recipient'
import { RecipientsRepository } from '../../repositories/recipient-repositories/recipients-repository'

export interface FetchRecipientsUseCaseRequest {
  requestResponsibleId: string
}

export type FetchRecipientsUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { recipients: Recipient[] }
>

export class FetchRecipientsUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_recipient', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const recipients = await this.recipientsRepository.findMany()

    return right({ recipients })
  }
}
