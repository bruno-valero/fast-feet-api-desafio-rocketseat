import { AdmUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adm-updates-repository'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { AttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/attachments-repository'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { CourierUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-updates-repository'
import { OrderAttachmentsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-attachments-repository'
import { OrderUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/order-updates-repository'
import { OrdersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/order-repositories/orders-repository'
import { RecipientUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipient-updates-repository'
import { RecipientsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/recipient-repositories/recipients-repository'
import { NotificationsRepository } from '@/domain/generic/notification/application/repositories/notifications-repository'
import { ModuleMetadata, Provider } from '@nestjs/common'
import { PrismaAdmUpdatesRepository } from '../repositories/prisma-adm-repositories/prisma-adm-updates-repository'
import { PrismaAdmsRepository } from '../repositories/prisma-adm-repositories/prisma-adms-repository'
import { PrismaAttachmentsRepository } from '../repositories/prisma-attachments-repository'
import { PrismaCouriersRepository } from '../repositories/prisma-courier-repositories/prisma-courier-repository'
import { PrismaCourierUpdatesRepository } from '../repositories/prisma-courier-repositories/prisma-courier-updates-repository'
import { PrismaNotificationsRepository } from '../repositories/prisma-notification-repository'
import { PrismaOrderAttachmentsRepository } from '../repositories/prisma-order-repositories/prisma-order-attachments-repository'
import { PrismaOrderUpdatesRepository } from '../repositories/prisma-order-repositories/prisma-order-updates-repository'
import { PrismaOrdersRepository } from '../repositories/prisma-order-repositories/prisma-orders-repository'
import { PrismaRecipientUpdatesRepository } from '../repositories/prisma-recipient-repositories/prisma-recipient-updates-repository'
import { PrismaRecipientsRepository } from '../repositories/prisma-recipient-repositories/prisma-recipients-repository'

const admRepositories: Provider[] = [
  { provide: AdmUpdatesRepository, useClass: PrismaAdmUpdatesRepository },
  { provide: AdmsRepository, useClass: PrismaAdmsRepository },
]

const courierRepositories: Provider[] = [
  { provide: CouriersRepository, useClass: PrismaCouriersRepository },
  {
    provide: CourierUpdatesRepository,
    useClass: PrismaCourierUpdatesRepository,
  },
]

const orderRepositories: Provider[] = [
  {
    provide: OrderAttachmentsRepository,
    useClass: PrismaOrderAttachmentsRepository,
  },
  { provide: OrderUpdatesRepository, useClass: PrismaOrderUpdatesRepository },
  { provide: OrdersRepository, useClass: PrismaOrdersRepository },
]

const recipientRepositories: Provider[] = [
  {
    provide: RecipientUpdatesRepository,
    useClass: PrismaRecipientUpdatesRepository,
  },
  { provide: RecipientsRepository, useClass: PrismaRecipientsRepository },
]

const attachmentRepositories: Provider[] = [
  { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
]

const eventsRepositoris: Provider[] = [
  { provide: NotificationsRepository, useClass: PrismaNotificationsRepository },
]

export const repositories: Provider[] = [
  ...admRepositories,
  ...courierRepositories,
  ...orderRepositories,
  ...recipientRepositories,
  ...attachmentRepositories,
  ...eventsRepositoris,
]

export const repositoriesExports: NonNullable<ModuleMetadata['exports']> = [
  AdmUpdatesRepository,
  AdmsRepository,
  CouriersRepository,
  CourierUpdatesRepository,
  OrderAttachmentsRepository,
  OrderUpdatesRepository,
  OrdersRepository,
  RecipientUpdatesRepository,
  RecipientsRepository,
  AttachmentsRepository,
  NotificationsRepository,
]
