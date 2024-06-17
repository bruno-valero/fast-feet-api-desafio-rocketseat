import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Encrypter } from '../../../cryptography/encrypter'
import { Encoder } from '../../../cryptography/encoder'
import { AdmsRepository } from '../../../repositories/adm-repositories/adms-repository'
import { Injectable } from '@nestjs/common'

export interface AuthenticateAdmUseCaseRequest {
  cpf: string
  password: string
}

export type AuthenticateAdmUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    token: string
  }
>

@Injectable()
export class AuthenticateAdmUseCase {
  constructor(
    private admsRepository: AdmsRepository,
    private encrypter: Encrypter,
    private encoder: Encoder,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdmUseCaseRequest): Promise<AuthenticateAdmUseCaseResponse> {
    const adm = await this.admsRepository.findByCpf(cpf)

    if (!adm) return left(new ResourceNotFoundError())

    const isValidPassword = await this.encrypter.compare(password, adm.password)

    if (!isValidPassword) return left(new UnauthorizedError())

    const token = await this.encoder.encode({
      sub: adm.id.value,
      role: adm.role,
    })

    return right({
      token,
    })
  }
}
