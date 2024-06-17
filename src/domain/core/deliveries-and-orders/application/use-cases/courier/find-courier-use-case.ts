import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Courier } from '../../../enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

export interface FindCourierUseCaseRequest {
  requestResponsibleId: string
  courierId: string
}

export type FindCourierUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { courier: Courier }
>

@Injectable()
export class FindCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
    courierId,
  }: FindCourierUseCaseRequest): Promise<FindCourierUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_courier', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) return left(new ResourceNotFoundError())

    return right({ courier })
  }
}
