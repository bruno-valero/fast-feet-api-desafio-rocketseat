import { NotificationsRepository } from '@/domain/generic/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/generic/notification/enterprise/entities/notification'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prisma.prismaNotification.create({
      data: PrismaNotificationMapper.domainToPrisma(notification),
    })
  }

  async getById(notificationId: string): Promise<Notification | null> {
    const prismaData = await this.prisma.prismaNotification.findUnique({
      where: {
        id: notificationId,
      },
    })

    if (!prismaData) return null

    const dataMapped = PrismaNotificationMapper.toDomain(prismaData)

    return dataMapped
  }

  async update(notification: Notification): Promise<void> {
    console.log('update notification', notification)
    const data = PrismaNotificationMapper.domainToPrisma(notification)
    console.log('update id', notification.id.value)
    console.log('update data', data)
    await this.prisma.prismaNotification.update({
      where: {
        id: notification.id.value,
      },
      data,
    })
  }
}
