import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
// import { Public } from '@/infra/auth/public'
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attatchment-type-error'
import { UploadOrderDeliveryPhotoUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/upload-order-delivery-photo-use-case'
import { FileInterceptor } from '@nestjs/platform-express'

// const paramsSchema = z.object({
//   id: z.string().uuid(),
// })

// const querySchema = z.object({
//   returnCause: z.string().min(10),
// })

// const bodySchema = z.object({
//   cpf: z.string().refine((cpf) => validaCPF(cpf), 'must be a valid cpf'),
//   name: z.string(),
// })

// type ParamsSchema = z.infer<typeof paramsSchema>
// type QuerySchema = z.infer<typeof querySchema>
// type BodySchema = z.infer<typeof bodySchema>

// const pipeParams = new ZodValidationPipe(paramsSchema)
// const pipeQuery = new ZodValidationPipe(querySchema)
// const pipeBody = new ZodValidationPipe(bodySchema)

@Controller('/orders/deliver/photo-upload')
// @Public()
export class UploadOrderPhotoController {
  constructor(
    private UploadOrderDeliveredPhoto: UploadOrderDeliveryPhotoUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '.(jpeg|png|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    // @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.UploadOrderDeliveredPhoto.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (resp.isLeft()) {
      const value = resp.value

      if (value instanceof InvalidAttachmentTypeError) {
        throw new BadRequestException(value.message)
      }

      throw new BadRequestException()
    }

    if (resp.isRight()) {
      const value = resp.value

      return { attachment: value.attachment.id.value }
    }
  }
}
