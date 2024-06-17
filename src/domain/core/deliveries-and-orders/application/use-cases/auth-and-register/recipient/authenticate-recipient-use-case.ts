import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Encrypter } from '../../../cryptography/encrypter'
import { Encoder } from '../../../cryptography/encoder'
import { RecipientsRepository } from '../../../repositories/recipient-repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

export interface AuthenticateRecipientUseCaseRequest {
  cpf: string
  password: string
}

export type AuthenticateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    token: string
  }
>

@Injectable()
export class AuthenticateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private encrypter: Encrypter,
    private encoder: Encoder,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateRecipientUseCaseRequest): Promise<AuthenticateRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByCpf(cpf)

    if (!recipient) return left(new ResourceNotFoundError())

    const isValidPassword = await this.encrypter.compare(
      password,
      recipient.password,
    )

    if (!isValidPassword) return left(new UnauthorizedError())

    const token = await this.encoder.encode({
      sub: recipient.id.value,
      role: recipient.role,
    })

    return right({
      token,
    })
  }
}
