import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { FetchCouriersUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/fetch-couriers-use-case'

export function makeFetchCouriersUseCase(props?: {
  couriersRepositoryAlt?: CouriersRepository
  admsRepositoryAlt?: AdmsRepository
}) {
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()

  const useCase = new FetchCouriersUseCase(couriersRepository, admsRepository)

  return {
    useCase,
    dependencies: {
      couriersRepository,
      admsRepository,
    },
  }
}
