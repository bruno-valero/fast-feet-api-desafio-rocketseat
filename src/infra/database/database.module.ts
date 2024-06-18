import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { repositories } from './prisma/prisma.exports'

@Module({
  providers: [PrismaService, ...repositories],
})
export class DatabaseModule {}
