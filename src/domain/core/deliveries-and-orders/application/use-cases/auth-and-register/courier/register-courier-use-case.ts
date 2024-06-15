import { Either, left, right } from '@/core/either'
import { Permissions } from '../../../../enterprise/authorization/authorization'
import { AdmsRepository } from '../../../repositories/adm-repositories/adms-repository'
import { CouriersRepository } from '../../../repositories/courier-repositories/courier-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Courier } from '../../../../enterprise/entities/courier'
import { Cpf } from '../../../../enterprise/entities/value-objects/cpf'
import { Encrypter } from '../../../cryptography/encrypter'

export interface RegisterCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
  requestResponsibleId: string
}

export type RegisterCourierUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

export class RegisterCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private admsRepository: AdmsRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    name,
    password,
    requestResponsibleId,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)

    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission('create_courier', adm.role)

    if (!hasPermission) return left(new UnauthorizedError())

    const courier = Courier.create({
      cpf: new Cpf(cpf),
      name,
      password,
    })

    const hashedPassword = await this.encrypter.hash(courier.password)

    courier.hashPassword(hashedPassword)

    await this.couriersRepository.create(courier)

    return right(null)
  }
}
