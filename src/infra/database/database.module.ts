import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import {
  repositories,
  repositoriesExports,
} from './prisma/@exports/prisma.exports'

@Module({
  providers: [PrismaService, ...repositories],
  exports: [...repositoriesExports],
})
export class DatabaseModule {}
