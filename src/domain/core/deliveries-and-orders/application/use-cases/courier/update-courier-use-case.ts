import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { CourierUpdatesRepository } from '../../repositories/courier-repositories/courier-updates-repository'

export interface UpdateCourierUseCaseRequest {
  courierId: string
  name: string
  cpf: string
  admId: string
}

export type UpdateCourierUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

export class UpdateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private admsRepository: AdmsRepository,
    private courierUpdatesRepository: CourierUpdatesRepository,
  ) {}

  async execute({
    courierId,
    cpf,
    name,
    admId,
  }: UpdateCourierUseCaseRequest): Promise<UpdateCourierUseCaseResponse> {
    const adm = await this.admsRepository.findById(admId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('update_courier', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) return left(new ResourceNotFoundError())

    const { data: update } = courier.changeData(
      { cpf, name },
      new UniqueEntityId(admId),
    )
    await this.couriersRepository.update(courier)
    await this.courierUpdatesRepository.create(update)

    return right(null)
  }
}
