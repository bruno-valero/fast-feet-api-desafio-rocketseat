import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaRecipientMapper } from '../../mappers/prisma-recipient-mapper'

@Injectable()
export class PrismaRecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    await this.prisma.prismaUser.create({
      data: PrismaRecipientMapper.domainToPrisma(recipient),
    })
  }

  async update(recipient: Recipient): Promise<void> {
    await this.prisma.prismaUser.update({
      where: {
        id: recipient.id.value,
        role: 'recipient',
      },
      data: PrismaRecipientMapper.domainToPrisma(recipient),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prismaUser.delete({
      where: {
        id,
        role: 'recipient',
      },
    })
  }

  async findById(id: string): Promise<Recipient | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        id,
        role: 'recipient',
      },
    })

    if (!data) return null

    const mappedData = PrismaRecipientMapper.toDomain(data)

    return mappedData
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        cpf,
        role: 'recipient',
      },
    })

    if (!data) return null

    const mappedData = PrismaRecipientMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<Recipient[]> {
    const data = await this.prisma.prismaUser.findMany({
      where: {
        role: 'recipient',
      },
    })

    const mappedData = data.map(PrismaRecipientMapper.toDomain)

    return mappedData
  }
}
