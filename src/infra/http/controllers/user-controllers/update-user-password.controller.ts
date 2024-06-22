import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
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
import { UpdateCourierPasswordUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/update-courier-password-use-case'
import { UpdateRecipientPasswordUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/update-recipient-password-use-case'

const paramsSchema = z.object({
  role: z.enum(['recipient', 'adm', 'courier']),
  id: z.string().uuid(),
})

const bodySchema = z.object({
  password: z.string(),
})

type ParamsSchema = z.infer<typeof paramsSchema>
type BodySchema = z.infer<typeof bodySchema>

const pipeParams = new ZodValidationPipe(paramsSchema)
const pipeBody = new ZodValidationPipe(bodySchema)

@Controller('/users/:role/:id/update-password')
// @Public()
export class UpdateUserPasswordController {
  constructor(
    private updateCourierPassword: UpdateCourierPasswordUseCase,
    private updateRecipientPassword: UpdateRecipientPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param(pipeParams) { role, id }: ParamsSchema,
    @Body(pipeBody) body: BodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    let resp: Either<ResourceNotFoundError | UnauthorizedError, null>

    if (role === 'courier') {
      resp = await this.updateCourierPassword.execute({
        requestResponsibleId,
        courierId: id,
        ...body,
      })
    } else if (role === 'recipient') {
      resp = await this.updateRecipientPassword.execute({
        requestResponsibleId,
        recipientId: id,
        ...body,
      })
    } else {
      throw new BadRequestException(`cannot update an admin password`)
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
