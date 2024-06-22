import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { useCases } from './controllers/@exports/use-cases.exports'
import { AuthModule } from '../auth/auth.module'
import { controllers } from './controllers/@exports/controllers.exports'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule],
  providers: [...useCases],
  controllers: [...controllers],
})
export class HttpModule {}
