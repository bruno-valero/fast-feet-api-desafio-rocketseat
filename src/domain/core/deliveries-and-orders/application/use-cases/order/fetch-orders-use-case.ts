import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Order } from '../../../enterprise/entities/order'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { Injectable } from '@nestjs/common'

export interface FetchOrdersUseCaseRequest {
  requestResponsibleId: string
}

export type FetchOrdersUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { orders: Order[] }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_order', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const orders = await this.ordersRepository.findMany()

    return right({ orders })
  }
}
