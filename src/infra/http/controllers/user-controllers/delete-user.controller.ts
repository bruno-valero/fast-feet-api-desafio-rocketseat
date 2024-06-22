import {
  BadRequestException,
  Controller,
  Delete,
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
import { DeleteCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/delete-courier-use-case'
import { Either } from '@/core/either'
import { DeleteRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/delete-recipient-use-case'

const paramsSchema = z.object({
  role: z.enum(['recipient', 'adm', 'courier']),
  id: z.string().uuid(),
})

type ParamsSchema = z.infer<typeof paramsSchema>

const pipe = new ZodValidationPipe(paramsSchema)

@Controller('/users/:role/:id')
// @Public()
export class DeleteUserController {
  constructor(
    private deleteCourier: DeleteCourierUseCase,
    private deleteRecipient: DeleteRecipientUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(pipe) { id, role }: ParamsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    let resp: Either<ResourceNotFoundError | UnauthorizedError, null>

    if (role === 'courier') {
      resp = await this.deleteCourier.execute({
        requestResponsibleId,
        courierId: id,
      })
    } else if (role === 'recipient') {
      resp = await this.deleteRecipient.execute({
        requestResponsibleId,
        recipientId: id,
      })
    } else {
      throw new BadRequestException(`cannot delete an admin`)
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
