import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import { Injectable } from '@nestjs/common'

export interface DeleteCourierUseCaseRequest {
  requestResponsibleId: string
  courierId: string
}

export type DeleteCourierUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class DeleteCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private admsRepository: AdmsRepository,
  ) {}

  async execute({
    requestResponsibleId,
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('read_courier', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    await this.couriersRepository.delete(courierId)

    return right(null)
  }
}
