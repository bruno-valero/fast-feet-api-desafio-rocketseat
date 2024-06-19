import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { useCases } from './controllers/use-cases.exports'

@Module({
  imports: [DatabaseModule],
  providers: [...useCases],
})
export class HttpModule {}
