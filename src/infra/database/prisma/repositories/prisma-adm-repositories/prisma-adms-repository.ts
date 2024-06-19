import { Adm } from '@/domain/core/deliveries-and-orders/enterprise/entities/adm'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaAdmMapper } from '../../mappers/prisma-adm-mapper'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'

@Injectable()
export class PrismaAdmsRepository implements AdmsRepository {
  constructor(private prisma: PrismaService) {}

  async create(adm: Adm): Promise<void> {
    await this.prisma.prismaUser.create({
      data: PrismaAdmMapper.domainToPrisma(adm),
    })
  }

  async update(adm: Adm): Promise<void> {
    await this.prisma.prismaUser.update({
      where: {
        id: adm.id.value,
        role: 'adm',
      },
      data: PrismaAdmMapper.domainToPrisma(adm),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prismaUser.delete({
      where: {
        id,
        role: 'adm',
      },
    })
  }

  async findById(id: string): Promise<Adm | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        id,
        role: 'adm',
      },
    })

    if (!data) return null

    const mappedData = PrismaAdmMapper.toDomain(data)

    return mappedData
  }

  async findByCpf(cpf: string): Promise<Adm | null> {
    const data = await this.prisma.prismaUser.findUnique({
      where: {
        cpf,
        role: 'adm',
      },
    })

    if (!data) return null

    const mappedData = PrismaAdmMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<Adm[]> {
    const data = await this.prisma.prismaUser.findMany({
      where: {
        role: 'adm',
      },
    })

    const mappedData = data.map(PrismaAdmMapper.toDomain)

    return mappedData
  }
}
