import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Encrypter } from '../../../cryptography/encrypter'
import { CouriersRepository } from '../../../repositories/courier-repositories/courier-repository'
import { Encoder } from '../../../cryptography/encoder'
import { Injectable } from '@nestjs/common'

export interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

export type AuthenticateCourierUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    token: string
  }
>

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private encrypter: Encrypter,
    private encoder: Encoder,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCpf(cpf)

    if (!courier) return left(new ResourceNotFoundError())

    const isValidPassword = await this.encrypter.compare(
      password,
      courier.password,
    )

    if (!isValidPassword) return left(new UnauthorizedError())

    const token = await this.encoder.encode({
      sub: courier.id.value,
      role: courier.role,
    })

    return right({
      token,
    })
  }
}
