import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { UpdateCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/update-courier-use-case'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { CourierUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-updates-repository'
import { InMemoryCourierUpdatesRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-courier-updates-repository'

export function makeUpdateCourierUseCase(props?: {
  couriersRepositoryAlt?: CouriersRepository
  admsRepositoryAlt?: AdmsRepository
  encrypterAlt?: Encrypter
  courierUpdatesRepositoryAlt?: CourierUpdatesRepository
}) {
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const courierUpdatesRepository =
    props?.courierUpdatesRepositoryAlt ?? new InMemoryCourierUpdatesRepository()

  const useCase = new UpdateCourierUseCase(
    couriersRepository,
    admsRepository,
    courierUpdatesRepository,
  )

  return {
    useCase,
    dependencies: {
      couriersRepository,
      admsRepository,
      courierUpdatesRepository,
    },
  }
}
