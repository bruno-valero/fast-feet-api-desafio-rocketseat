import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { DeleteCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/delete-courier-use-case'

export function makeDeleteCourierUseCase(props?: {
  couriersRepositoryAlt?: CouriersRepository
  admsRepositoryAlt?: AdmsRepository
}) {
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()

  const useCase = new DeleteCourierUseCase(couriersRepository, admsRepository)

  return {
    useCase,
    dependencies: {
      couriersRepository,
      admsRepository,
    },
  }
}
