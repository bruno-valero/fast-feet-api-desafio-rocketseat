import { Either, left, right } from '@/core/either'
import { Permissions } from '@/domain/core/deliveries-and-orders/enterprise/authorization/authorization'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../../repositories/courier-repositories/courier-repository'
import { AdmsRepository } from '../../repositories/adm-repositories/adms-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { CourierUpdatesRepository } from '../../repositories/courier-repositories/courier-updates-repository'
import { Encrypter } from '../../cryptography/encrypter'

export interface UpdateCourierPasswordUseCaseRequest {
  courierId: string
  password: string
  requestResponsibleId: string
}

export type UpdateCourierPasswordUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

export class UpdateCourierPasswordUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private admsRepository: AdmsRepository,
    private courierUpdatesRepository: CourierUpdatesRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    courierId,
    password,
    requestResponsibleId,
  }: UpdateCourierPasswordUseCaseRequest): Promise<UpdateCourierPasswordUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)
    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('update_courier', adm.role)
    if (!hasPermission) return left(new UnauthorizedError())

    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) return left(new ResourceNotFoundError())

    const passwordHash = await this.encrypter.hash(password)

    const { data: update } = courier.changePassword(
      passwordHash,
      new UniqueEntityId(requestResponsibleId),
    )
    await this.couriersRepository.update(courier)
    await this.courierUpdatesRepository.create(update)

    return right(null)
  }
}
