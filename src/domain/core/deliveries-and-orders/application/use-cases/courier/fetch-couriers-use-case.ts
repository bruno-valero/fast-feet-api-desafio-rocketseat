import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Courier } from '../../../enterprise/entities/courier'

export interface FetchCouriersUseCaseRequest {
  requestResponsibleId: string
}

export type FetchCouriersUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { couriers: Courier[] }
>

export class FetchCouriersUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
  }: FetchCouriersUseCaseRequest): Promise<FetchCouriersUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_courier', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const couriers = await this.couriersRepository.findMany()

    return right({ couriers })
  }
}
