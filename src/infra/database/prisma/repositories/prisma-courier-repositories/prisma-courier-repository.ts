import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaCourierMapper } from '../../mappers/prisma-courier-mapper'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {}

  async create(courier: Courier): Promise<void> {
    await this.prisma.prismaUser.create({
      data: PrismaCourierMapper.domainToPrisma(courier),
    })
  }

  async update(courier: Courier): Promise<void> {
    await this.prisma.prismaUser.update({
      where: {
        id: courier.id.value,
        role: 'courier',
      },
      data: PrismaCourierMapper.domainToPrisma(courier),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prismaUser.delete({
      where: {
        id,
        role: 'courier',
      },
    })
  }

  async findById(id: string): Promise<Courier | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        id,
        role: 'courier',
      },
    })

    if (!data) return null

    const mappedData = PrismaCourierMapper.toDomain(data)

    return mappedData
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        cpf,
        role: 'courier',
      },
    })

    if (!data) return null

    const mappedData = PrismaCourierMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<Courier[]> {
    const data = await this.prisma.prismaUser.findMany({
      where: {
        role: 'courier',
      },
    })

    const mappedData = data.map(PrismaCourierMapper.toDomain)

    return mappedData
  }
}
