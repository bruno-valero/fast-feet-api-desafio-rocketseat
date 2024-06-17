import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Order } from '../../../enterprise/entities/order'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { Injectable } from '@nestjs/common'

export interface FindOrderUseCaseRequest {
  requestResponsibleId: string
  orderId: string
}

export type FindOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { order: Order }
>

@Injectable()
export class FindOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
    orderId,
  }: FindOrderUseCaseRequest): Promise<FindOrderUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_order', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const order = await this.ordersRepository.findById(orderId)
    if (!order) return left(new ResourceNotFoundError())

    return right({ order })
  }
}
