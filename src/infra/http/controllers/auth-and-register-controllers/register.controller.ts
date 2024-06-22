import { RegisterCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/courier/register-courier-use-case'
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
// import { Public } from '@/infra/auth/public'
import { RegisterRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/recipient/register-recipient-use-case'
import { Either } from '@/core/either'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'

const bodySchema = z.object({
  cpf: z.string().refine((cpf) => validaCPF(cpf), 'must be a valid cpf'),
  name: z.string(),
  password: z.string(),
  role: z.enum(['recipient', 'adm', 'courier']),
})

type BodySchema = z.infer<typeof bodySchema>

const pipe = new ZodValidationPipe(bodySchema)

@Controller('/register')
// @Public()
export class RegisterController {
  constructor(
    private registerCourier: RegisterCourierUseCase,
    private registerRecipient: RegisterRecipientUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(pipe) { role, ...body }: BodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub
    let resp: Either<ResourceNotFoundError | UnauthorizedError, null>
    if (role === 'courier') {
      resp = await this.registerCourier.execute({
        ...body,
        requestResponsibleId,
      })
    } else if (role === 'recipient') {
      resp = await this.registerRecipient.execute({
        ...body,
        requestResponsibleId,
      })
    } else {
      throw new BadRequestException(`cannot register an admin`)
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
      // const value = resp.value
    }
  }
}
