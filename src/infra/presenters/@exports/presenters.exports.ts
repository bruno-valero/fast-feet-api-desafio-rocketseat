import { ModuleMetadata } from '@nestjs/common'
import { OrderPresenter } from '../http-presenters/order-presenter'
import { CourierPresenter } from '../http-presenters/courier-presenter'
import { RecipientPresenter } from '../http-presenters/recipient-presenter'

const httpPresenters: NonNullable<ModuleMetadata['controllers']> = [
  OrderPresenter,
  CourierPresenter,
  RecipientPresenter,
]

export const presenters: NonNullable<ModuleMetadata['controllers']> = [
  ...httpPresenters,
]
