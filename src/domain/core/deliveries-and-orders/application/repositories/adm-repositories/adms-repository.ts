import { Injectable } from '@nestjs/common'
import { Adm } from '../../../enterprise/entities/adm'

@Injectable()
export abstract class AdmsRepository {
  abstract create(adm: Adm): Promise<void>
  abstract update(adm: Adm): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Adm | null>
  abstract findByCpf(cpf: string): Promise<Adm | null>
  abstract findMany(): Promise<Adm[]>
}
