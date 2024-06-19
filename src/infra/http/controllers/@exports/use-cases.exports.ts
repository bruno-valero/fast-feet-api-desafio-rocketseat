import { AuthenticateAdmUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/adm/authenticate-adm-use-case'
import { AuthenticateCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/courier/authenticate-courier-use-case'
import { RegisterCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/courier/register-courier-use-case'
import { AuthenticateRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/recipient/authenticate-recipient-use-case'
import { RegisterRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/recipient/register-recipient-use-case'
import { DeleteCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/delete-courier-use-case'
import { FetchCouriersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/fetch-couriers-use-case'
import { FindCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/find-courier-use-case'
import { UpdateCourierPasswordUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/update-courier-password-use-case'
import { UpdateCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/update-courier-use-case'
import { CollectOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/collect-order-use-case'
import { CreateOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/create-order-use-case'
import { DeleteOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/delete-order-use-case'
import { DeliverOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/deliver-order-use-case'
import { FetchCourierOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-courier-orders-use-case'
import { FetchNearbyOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-nearby-orders-use-case'
import { FetchOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-orders-use-case'
import { FetchRecipientOrdersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/fetch-recipient-orders-use-case'
import { FindOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/find-order-use-case'
import { MarkOrderAsAwaitingForPickupUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/mark-order-as-awaiting-for-pickup-use-case'
import { ReturnOrderUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/order/return-order-use-case'
import { DeleteRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/delete-recipient-use-case'
import { FetchRecipientsUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/fetch-recipients-use-case'
import { FindRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/find-recipient-use-case'
import { UpdateRecipientPasswordUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/update-recipient-password-use-case'
import { UpdateRecipientUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/recipient/update-recipient-use-case'
import { Provider } from '@nestjs/common'

const admUseCases: Provider[] = [AuthenticateAdmUseCase]

const courierUseCases: Provider[] = [
  AuthenticateCourierUseCase,
  RegisterCourierUseCase,
  DeleteCourierUseCase,
  FetchCouriersUseCase,
  FindCourierUseCase,
  UpdateCourierPasswordUseCase,
  UpdateCourierUseCase,
]

const orderUseCases: Provider[] = [
  CollectOrderUseCase,
  CreateOrderUseCase,
  DeleteOrderUseCase,
  DeliverOrderUseCase,
  FetchCourierOrdersUseCase,
  FetchNearbyOrdersUseCase,
  FetchOrdersUseCase,
  FetchRecipientOrdersUseCase,
  FindOrderUseCase,
  MarkOrderAsAwaitingForPickupUseCase,
  ReturnOrderUseCase,
]

const recipientUseCases: Provider[] = [
  AuthenticateRecipientUseCase,
  RegisterRecipientUseCase,
  DeleteRecipientUseCase,
  FetchRecipientsUseCase,
  FindRecipientUseCase,
  UpdateRecipientPasswordUseCase,
  UpdateRecipientUseCase,
]

export const useCases: Provider[] = [
  ...admUseCases,
  ...courierUseCases,
  ...orderUseCases,
  ...recipientUseCases,
]
