import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Order } from '../../../enterprise/entities/order'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../../repositories/recipient-repositories/recipients-repository'
import { UserRoles } from '../../../enterprise/entities/abstract/user'
import { Adm } from '../../../enterprise/entities/adm'
import { Recipient } from '../../../enterprise/entities/recipient'

export interface FetchRecipientOrdersUseCaseRequest {
  requestResponsibleId: string
  recipientId: string
  requestResponsibleRole: UserRoles
}

export type FetchRecipientOrdersUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { orders: Order[] }
>

@Injectable()
export class FetchRecipientOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    requestResponsibleRole,
    requestResponsibleId,
    recipientId,
  }: FetchRecipientOrdersUseCaseRequest): Promise<FetchRecipientOrdersUseCaseResponse> {
    let responsible: Adm | Recipient | null = null

    if (requestResponsibleRole === 'adm') {
      responsible = await this.admsRepository.findById(requestResponsibleId)
    }
    if (requestResponsibleRole === 'recipient') {
      responsible =
        await this.recipientsRepository.findById(requestResponsibleId)
    }
    if (!responsible) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'list_recipient_orders',
      responsible.role,
    )
    if (!hasPermission) return left(new UnauthorizedError())

    const orders =
      await this.ordersRepository.findManyByRecipientId(recipientId)

    return right({ orders })
  }
}
