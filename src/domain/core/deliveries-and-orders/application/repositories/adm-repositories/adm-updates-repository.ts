import { Injectable } from '@nestjs/common'
import { UpdateAdm } from '../../../enterprise/entities/update-adm'

@Injectable()
export abstract class AdmUpdatesRepository {
  abstract create(update: UpdateAdm): Promise<void>
  abstract update(update: UpdateAdm): Promise<void>
  abstract findById(id: string): Promise<UpdateAdm | null>
  abstract findMany(): Promise<UpdateAdm[]>
}
