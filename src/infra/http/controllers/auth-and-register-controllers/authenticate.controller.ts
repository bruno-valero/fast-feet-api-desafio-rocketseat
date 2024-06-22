import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import z from 'zod'
import { validaCPF } from '../../utils/isCPF'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Public } from '@/infra/auth/public'
import { Either } from '@/core/either'
import { AuthenticateAdmUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/adm/authenticate-adm-use-case'
import { AuthenticateRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/recipient/authenticate-recipient-use-case'
import { AuthenticateCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/courier/authenticate-courier-use-case'

const bodySchema = z.object({
  cpf: z.string().refine((cpf) => validaCPF(cpf), 'must be a valid cpf'),
  password: z.string(),
  role: z.enum(['recipient', 'adm', 'courier']),
})

type BodySchema = z.infer<typeof bodySchema>

const pipe = new ZodValidationPipe(bodySchema)

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private authenticateCourier: AuthenticateCourierUseCase,
    private authenticateRecipient: AuthenticateRecipientUseCase,
    private authenticateAdm: AuthenticateAdmUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(pipe) { role, ...body }: BodySchema) {
    let resp: Either<
      ResourceNotFoundError | UnauthorizedError,
      {
        token: string
      }
    >
    if (role === 'courier') {
      resp = await this.authenticateCourier.execute(body)
    } else if (role === 'recipient') {
      resp = await this.authenticateRecipient.execute(body)
    } else {
      resp = await this.authenticateAdm.execute(body)
    }

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof ResourceNotFoundError) {
        throw new NotFoundException({ message: value.message })
      }
      if (value instanceof UnauthorizedError) {
        throw new UnauthorizedException({ message: value.message })
      }

      throw new BadRequestException()
    }

    if (resp.isRight()) {
      const token = resp.value.token

      return { token }
    }
  }
}
