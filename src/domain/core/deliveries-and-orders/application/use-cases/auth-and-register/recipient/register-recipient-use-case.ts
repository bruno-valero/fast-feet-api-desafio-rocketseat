import { Either, left, right } from '@/core/either'
import { Permissions } from '../../../../enterprise/authorization/authorization'
import { AdmsRepository } from '../../../repositories/adm-repositories/adms-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Recipient } from '../../../../enterprise/entities/recipient'
import { Cpf } from '../../../../enterprise/entities/value-objects/cpf'
import { Encrypter } from '../../../cryptography/encrypter'
import { RecipientsRepository } from '../../../repositories/recipient-repositories/recipients-repository'

export interface RegisterRecipientUseCaseRequest {
  name: string
  cpf: string
  password: string
  requestResponsibleId: string
}

export type RegisterRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

export class RegisterRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private admsRepository: AdmsRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    name,
    password,
    requestResponsibleId,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const adm = await this.admsRepository.findById(requestResponsibleId)

    if (!adm) return left(new ResourceNotFoundError())

    const hasPermission = Permissions.hasPermission(
      'create_recipient',
      adm.role,
    )

    if (!hasPermission) return left(new UnauthorizedError())

    const recipient = Recipient.create({
      cpf: new Cpf(cpf),
      name,
      password,
    })

    const hashedPassword = await this.encrypter.hash(recipient.password)

    recipient.hashPassword(hashedPassword)

    await this.recipientsRepository.create(recipient)

    return right(null)
  }
}
