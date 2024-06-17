import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { Injectable } from '@nestjs/common'

export interface DeleteOrderUseCaseRequest {
  requestResponsibleId: string
  orderId: string
}

export type DeleteOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_order', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    await this.ordersRepository.delete(orderId)

    return right(null)
  }
}
