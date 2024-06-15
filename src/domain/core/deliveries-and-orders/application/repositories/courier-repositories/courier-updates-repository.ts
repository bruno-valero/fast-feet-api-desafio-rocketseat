import { Injectable } from '@nestjs/common'
import { UpdateCourier } from '../../../enterprise/entities/update-courier'

@Injectable()
export abstract class CourierUpdatesRepository {
  abstract create(update: UpdateCourier): Promise<void>
  abstract update(update: UpdateCourier): Promise<void>
  abstract findById(id: string): Promise<UpdateCourier | null>
  abstract findMany(): Promise<UpdateCourier[]>
}
