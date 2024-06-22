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
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
// import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { CreateOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/create-order-use-case'

import {
  Address,
  addressCreationPropsSchema,
} from '@/domain/core/deliveries-and-orders/enterprise/entities/value-objects/address'
import UniqueEntityId from '@/core/entities/unique-entity-id'

// const paramsSchema = z.object({
//   id: z.string().uuid(),
// })

/* 
  bodySchema example

  address: makeAddress(),
  courierId: new UniqueEntityId('123'),
  recipientId: new UniqueEntityId('1188'),
*/

const bodySchema = z.object({
  address: addressCreationPropsSchema,
  courierId: z.string(),
  recipientId: z.string(),
})

// type ParamsSchema = z.infer<typeof paramsSchema>
type BodySchema = z.infer<typeof bodySchema>

// const pipeParams = new ZodValidationPipe(paramsSchema)
const pipeBody = new ZodValidationPipe(bodySchema)

@Controller('/orders')
// @Public()
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(pipeBody) body: BodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    const resp = await this.createOrder.execute({
      requestResponsibleId,
      creationProps: {
        address: new Address(body.address),
        courierId: new UniqueEntityId(body.courierId),
        recipientId: new UniqueEntityId(body.recipientId),
      },
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
    }
  }
}
