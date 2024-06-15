import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { OrderUpdatesRepository } from '../../repositories/order-repositories/order-updates-repository'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'

export interface UpdateOrderUseCaseRequest {
  orderId: string
  name: string
  cpf: string
  admId: string
}

export type UpdateOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

export class UpdateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
    private orderUpdatesRepository: OrderUpdatesRepository,
  ) {}

  async execute({
    orderId,
    cpf,
    name,
    admId,
  }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
    const adm = await this.admsRepository.findById(admId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('update_order', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const order = await this.ordersRepository.findById(orderId)
    if (!order) return left(new ResourceNotFoundError())

    const { data: update } = order.changeData(
      { cpf, name },
      new UniqueEntityId(admId),
    )
    await this.ordersRepository.update(order)
    await this.orderUpdatesRepository.create(update)

    return right(null)
  }
}
