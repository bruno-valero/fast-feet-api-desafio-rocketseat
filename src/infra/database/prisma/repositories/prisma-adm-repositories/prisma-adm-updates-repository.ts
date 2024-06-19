import { UpdateAdm } from '@/domain/core/deliveries-and-orders/enterprise/entities/update-adm'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUpdateAdmMapper } from '../../mappers/prisma-update-adm-mapper'
import { AdmUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adm-updates-repository'

@Injectable()
export class PrismaAdmUpdatesRepository implements AdmUpdatesRepository {
  constructor(private prisma: PrismaService) {}

  async create(update: UpdateAdm): Promise<void> {
    await this.prisma.prismaUpdates.create({
      data: PrismaUpdateAdmMapper.domainToPrisma(update),
    })
  }

  async update(update: UpdateAdm): Promise<void> {
    await this.prisma.prismaUpdates.update({
      where: {
        id: update.id.value,
        objectType: 'adm',
      },
      data: PrismaUpdateAdmMapper.domainToPrisma(update),
    })
  }

  async findById(id: string): Promise<UpdateAdm | null> {
    const data = await this.prisma.prismaUpdates.findUnique({
      where: {
        id,
        objectType: 'adm',
      },
    })

    if (!data) return null

    const mappedData = PrismaUpdateAdmMapper.toDomain(data)

    return mappedData
  }

  async findMany(): Promise<UpdateAdm[]> {
    const data = await this.prisma.prismaUpdates.findMany({
      where: {
        objectType: 'adm',
      },
    })

    const mappedData = data.map(PrismaUpdateAdmMapper.toDomain)

    return mappedData
  }
}
