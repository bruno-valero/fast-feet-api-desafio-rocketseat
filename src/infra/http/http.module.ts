import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { PresenterModule } from '../presenters/presenter.module'
import { StorageModule } from '../storage/storage.module'
import { controllers } from './controllers/@exports/controllers.exports'
import { useCases } from './controllers/@exports/use-cases.exports'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CryptographyModule,
    StorageModule,
    PresenterModule,
  ],
  providers: [...useCases],
  controllers: [...controllers],
})
export class HttpModule {}
