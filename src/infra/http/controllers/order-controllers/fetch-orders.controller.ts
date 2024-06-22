import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
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
import { FetchCourierOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-courier-orders-use-case'
import { FetchRecipientOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-recipient-orders-use-case'
import { FetchOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-orders-use-case'
import { userRoleSchema } from '@/domain/core/deliveries-and-orders/enterprise/entities/abstract/user'
import { Either } from '@/core/either'
import { Order } from '@/domain/core/deliveries-and-orders/enterprise/entities/order'

const paramsSchema = z.object({
  role: z.union([userRoleSchema, z.enum(['all'])]),
})

const querySchema = z.object({
  userId: z.string().uuid().optional(),
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

@Controller('/orders/:role')
// @Public()
export class FetchOrdersController {
  constructor(
    private fetchOrders: FetchOrdersUseCase,
    private fetchCourierOrders: FetchCourierOrdersUseCase,
    private fetchRecipientOrders: FetchRecipientOrdersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param(pipeParams) { role }: ParamsSchema,
    @Query(pipeQuery) { userId }: QuerySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub
    console.log('requestResponsibleId', requestResponsibleId)

    let resp: Either<
      ResourceNotFoundError | UnauthorizedError,
      { orders: Order[] }
    >

    if (role === 'all') {
      resp = await this.fetchOrders.execute({
        requestResponsibleId,
      })
    } else if (role === 'courier') {
      if (!userId) throw new BadRequestException('param id was not passed')
      resp = await this.fetchCourierOrders.execute({
        requestResponsibleId,
        courierId: userId,
        requestResponsibleRole: user.role,
      })
    } else if (role === 'recipient') {
      if (!userId) throw new BadRequestException('param id was not passed')
      resp = await this.fetchRecipientOrders.execute({
        requestResponsibleId,
        recipientId: userId,
        requestResponsibleRole: user.role,
      })
    } else {
      throw new BadRequestException('admins have not orders linked to them')
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
      const value = resp.value

      return { orders: value.orders }
    }
  }
}
