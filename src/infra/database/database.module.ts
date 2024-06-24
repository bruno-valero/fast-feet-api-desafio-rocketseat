import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import {
  repositories,
  repositoriesExports,
} from './prisma/@exports/prisma.exports'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [PrismaService, ...repositories],
  exports: [...repositoriesExports],
})
export class DatabaseModule {}
