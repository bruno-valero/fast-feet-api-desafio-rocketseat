import { Courier } from '../../../enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract create(courier: Courier): Promise<void>
  abstract update(courier: Courier): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Courier | null>
  abstract findByCpf(cpf: string): Promise<Courier | null>
  abstract findMany(): Promise<Courier[]>
}
