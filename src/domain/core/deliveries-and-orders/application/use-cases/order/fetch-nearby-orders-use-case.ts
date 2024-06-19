import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { OrdersRepository } from '../../repositories/order-repositories/orders-repository'
import { Coordinates } from '../../../enterprise/entities/value-objects/coordinates'
import { Order } from '../../../enterprise/entities/order'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { UserRoles } from '../../../enterprise/entities/abstract/user'
import { Adm } from '../../../enterprise/entities/adm'
import { Courier } from '../../../enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

export interface FetchNearbyOrdersUseCaseRequest {
  coordinates: Coordinates['raw']
  requestResponsibleId: string
  courierId: string
  requestResponsibleRole: UserRoles
}

export type FetchNearbyOrdersUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { orders: Order[] }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private admsRepository: AdmsRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    requestResponsibleId,
    courierId,
    coordinates,
    requestResponsibleRole,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    let responsible: Adm | Courier | null = null

    if (requestResponsibleRole === 'adm') {
      responsible = await this.admsRepository.findById(requestResponsibleId)
    }
    if (requestResponsibleRole === 'courier') {
      responsible = await this.couriersRepository.findById(requestResponsibleId)
    }
    if (!responsible) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'list_nearby_orders',
      responsible.role,
    )
    if (!hasPermission) return left(new UnauthorizedError())

    const orders = await this.ordersRepository.findManyNearBy(
      new Coordinates(coordinates),
      courierId,
    )

    return right({ orders })
  }
}
