import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
// import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ReturnOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/return-order-use-case'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

const querySchema = z.object({
  returnCause: z.string().min(10),
})

// const bodySchema = z.object({
//   cpf: z.string().refine((cpf) => validaCPF(cpf), 'must be a valid cpf'),
//   name: z.string(),
// })

type ParamsSchema = z.infer<typeof paramsSchema>
type QuerySchema = z.infer<typeof querySchema>
// type BodySchema = z.infer<typeof bodySchema>

const pipeParams = new ZodValidationPipe(paramsSchema)
const pipeQuery = new ZodValidationPipe(querySchema)
// const pipeBody = new ZodValidationPipe(bodySchema)

@Controller('/orders/:id/return')
// @Public()
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param(pipeParams) { id }: ParamsSchema,
    @Query(pipeQuery) { returnCause }: QuerySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    const resp = await this.returnOrder.execute({
      requestResponsibleId,
      orderId: id,
      returnCause,
    })

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
      // return { order: value.order }
    }
  }
}
