import { ModuleMetadata } from '@nestjs/common'
import { AuthenticateController } from '../auth-and-register-controllers/authenticate.controller'
import { RegisterController } from '../auth-and-register-controllers/register.controller'
import { DeleteUserController } from '../user-controllers/delete-user.controller'
import { FetchUsersController } from '../user-controllers/fetch-users.controller'
import { FindUserController } from '../user-controllers/find-user.controller'
import { UpdateUserPasswordController } from '../user-controllers/update-user-password.controller'
import { UpdateUserController } from '../user-controllers/update-user.controller'
import { CollectOrderController } from '../order-controllers/collect-order.controller'
import { CreateOrderController } from '../order-controllers/create-order.controller'
import { DeleteOrderController } from '../order-controllers/delete-order.controller'
import { DeliverOrderController } from '../order-controllers/deliver-order.controller'
import { FetchNearbyOrdersController } from '../order-controllers/fetch-nearby-orders.controller'
import { FetchOrdersController } from '../order-controllers/fetch-orders.controller'
import { FindOrderController } from '../order-controllers/find-order.controller'
import { MarkOrderAsAwaitingForPickupController } from '../order-controllers/mark-order-as-awaiting-for-pickup.controller'
import { ReturnOrderController } from '../order-controllers/return-order.controller'
import { UploadOrderPhotoController } from '../order-controllers/upload-order-delivered-photo.controller'
import { ReadNotificationController } from '../notification-controllers/read-notification.controller'

const authAndRegisterControllers: NonNullable<ModuleMetadata['controllers']> = [
  AuthenticateController,
  RegisterController,
]

const userControllers: NonNullable<ModuleMetadata['controllers']> = [
  DeleteUserController,
  FetchUsersController,
  FindUserController,
  UpdateUserPasswordController,
  UpdateUserController,
]

const orderControllers: NonNullable<ModuleMetadata['controllers']> = [
  CollectOrderController,
  CreateOrderController,
  DeleteOrderController,
  DeliverOrderController,
  FetchNearbyOrdersController,
  FetchOrdersController,
  FindOrderController,
  MarkOrderAsAwaitingForPickupController,
  ReturnOrderController,
  UploadOrderPhotoController,
]

const notificationController: NonNullable<ModuleMetadata['controllers']> = [
  ReadNotificationController,
]

export const controllers: NonNullable<ModuleMetadata['controllers']> = [
  ...authAndRegisterControllers,
  ...userControllers,
  ...orderControllers,
  ...notificationController,
]
