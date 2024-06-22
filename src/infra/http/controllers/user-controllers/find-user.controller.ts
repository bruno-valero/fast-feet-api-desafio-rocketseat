import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
// import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { Either } from '@/core/either'
import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import { FindCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/find-courier-use-case'
import { FindRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/find-recipient-use-case'

const paramsSchema = z.object({
  role: z.enum(['recipient', 'adm', 'courier']),
  id: z.string().uuid(),
})

type ParamsSchema = z.infer<typeof paramsSchema>

const pipe = new ZodValidationPipe(paramsSchema)

@Controller('/users/:role/:id')
// @Public()
export class FindUserController {
  constructor(
    private findCourier: FindCourierUseCase,
    private findRecipient: FindRecipientUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(pipe) { role, id }: ParamsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    let resp: Either<
      ResourceNotFoundError | UnauthorizedError,
      { courier: Courier } | { recipient: Recipient }
    >

    if (role === 'courier') {
      resp = await this.findCourier.execute({
        requestResponsibleId,
        courierId: id,
      })
    } else if (role === 'recipient') {
      resp = await this.findRecipient.execute({
        requestResponsibleId,
        recipientId: id,
      })
    } else {
      throw new BadRequestException(`cannot find an admin`)
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
      const value = resp.value[role]

      return {
        [role]: value,
      }
    }
  }
}
