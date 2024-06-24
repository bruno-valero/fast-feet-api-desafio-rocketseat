import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { presenters } from './@exports/presenters.exports'

@Module({
  providers: [...presenters, PrismaService],
  exports: [...presenters],
})
export class PresenterModule {}
