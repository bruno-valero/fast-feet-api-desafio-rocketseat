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
import { FetchCouriersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/fetch-couriers-use-case'
import { FetchRecipientsUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/fetch-recipients-use-case'
import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'

const paramsSchema = z.object({
  role: z.enum(['recipient', 'adm', 'courier']),
})

type ParamsSchema = z.infer<typeof paramsSchema>

const pipe = new ZodValidationPipe(paramsSchema)

@Controller('/users/:role')
// @Public()
export class FetchUsersController {
  constructor(
    private fetchCouriers: FetchCouriersUseCase,
    private fetchRecipients: FetchRecipientsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(pipe) { role }: ParamsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    let resp: Either<
      ResourceNotFoundError | UnauthorizedError,
      { couriers: Courier[] } | { recipients: Recipient[] }
    >

    if (role === 'courier') {
      resp = await this.fetchCouriers.execute({
        requestResponsibleId,
      })
    } else if (role === 'recipient') {
      resp = await this.fetchRecipients.execute({
        requestResponsibleId,
      })
    } else {
      throw new BadRequestException(`cannot fetch admins`)
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
      const value = resp.value[role + 's']

      return {
        [role + 's']: value,
      }
    }
  }
}
