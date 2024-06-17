import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { Order, OrderCreateProps } from '../../../enterprise/entities/order'

export interface CreateOrderUseCaseRequest {
  requestResponsibleId: string
  creationProps: OrderCreateProps
}

export type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
    creationProps,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('create_order', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const newOrder = Order.create(creationProps)

    await this.ordersRepository.create(newOrder)

    return right(null)
  }
}
