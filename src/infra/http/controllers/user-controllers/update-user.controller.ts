import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
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
import { UpdateCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/update-courier-use-case'
import { UpdateRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/update-recipient-use-case'
import { validaCPF } from '../../utils/isCPF'

const paramsSchema = z.object({
  role: z.enum(['recipient', 'adm', 'courier']),
  id: z.string().uuid(),
})

const bodySchema = z.object({
  cpf: z.string().refine((cpf) => validaCPF(cpf), 'must be a valid cpf'),
  name: z.string(),
})

type ParamsSchema = z.infer<typeof paramsSchema>
type BodySchema = z.infer<typeof bodySchema>

const pipeParams = new ZodValidationPipe(paramsSchema)
const pipeBody = new ZodValidationPipe(bodySchema)

@Controller('/users/:role/:id')
// @Public()
export class UpdateUserController {
  constructor(
    private updateCourier: UpdateCourierUseCase,
    private updateRecipient: UpdateRecipientUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param(pipeParams) { role, id }: ParamsSchema,
    @Body(pipeBody) body: BodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const requestResponsibleId = user.sub

    let resp: Either<ResourceNotFoundError | UnauthorizedError, null>

    if (role === 'courier') {
      resp = await this.updateCourier.execute({
        requestResponsibleId,
        courierId: id,
        ...body,
      })
    } else if (role === 'recipient') {
      resp = await this.updateRecipient.execute({
        requestResponsibleId,
        recipientId: id,
        ...body,
      })
    } else {
      throw new BadRequestException(`cannot update an admin`)
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
