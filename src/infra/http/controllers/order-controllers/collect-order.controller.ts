import {
  BadRequestException,
  Controller,
  HttpCode,
  InternalServerErrorException,
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
import { CollectOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/collect-order-use-case'
import { OrderAwaitingPickupError } from '@/core/errors/errors/order-errors/order-awaiting-for-pickup-error'
import { OrderIsClosedError } from '@/core/errors/errors/order-errors/order-is-closed-error'
import { InternalServerError } from '@/core/errors/errors/internal-server-error'
import { OrderAlreadyCollectedError } from '@/core/errors/errors/order-errors/order-already-collected-error'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

// const bodySchema = z.object({
//   cpf: z.string().refine((cpf) => validaCPF(cpf), 'must be a valid cpf'),
//   name: z.string(),
// })

type ParamsSchema = z.infer<typeof paramsSchema>
// type BodySchema = z.infer<typeof bodySchema>

const pipeParams = new ZodValidationPipe(paramsSchema)
// const pipeBody = new ZodValidationPipe(bodySchema)

@Controller('/orders/:id/collect')
// @Public()
export class CollectOrderController {
  constructor(private collectOrder: CollectOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param(pipeParams) { id }: ParamsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    const resp = await this.collectOrder.execute({
      requestResponsibleId,
      orderId: id,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof ResourceNotFoundError) {
        throw new NotFoundException({ message: value.message })
      }
      if (value instanceof UnauthorizedError) {
        throw new UnauthorizedException({ message: value.message })
      }
      if (value instanceof OrderAlreadyCollectedError) {
        throw new BadRequestException({ message: value.message })
      }

      const isAwaitingError = value instanceof OrderAwaitingPickupError
      const isClosedError = value instanceof OrderIsClosedError

      const isOrderError = isAwaitingError || isClosedError

      if (isOrderError) {
        throw new BadRequestException({ message: value.message })
      }

      if (value instanceof InternalServerError) {
        throw new InternalServerErrorException({ message: value.message })
      }

      throw new BadRequestException()
    }

    if (resp.isRight()) {
      // const value = resp.value
    }
  }
}
