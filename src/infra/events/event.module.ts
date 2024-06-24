import { Module } from '@nestjs/common'
import { providers } from './@exports/providers.exports'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [...providers],
})
export class EventModule {}
