import { Attachment } from '@/domain/core/deliveries-and-orders/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(update: Attachment): Promise<void>
  async findById(id: string): Promise<Attachment | null>
  async updateById(attachment: Attachment): Promise<void>
}
