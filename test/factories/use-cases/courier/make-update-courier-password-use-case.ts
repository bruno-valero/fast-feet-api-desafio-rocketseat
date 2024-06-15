import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { CourierUpdatesRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-updates-repository'
import { InMemoryCourierUpdatesRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-courier-updates-repository'
import { UpdateCourierPasswordUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/courier/update-courier-password-use-case'
import { FakeEncrypter } from 'test/factories/cryptography/fake-cryptography.ts/fake-encripter'

export function makeUpdateCourierPasswordUseCase(props?: {
  couriersRepositoryAlt?: CouriersRepository
  admsRepositoryAlt?: AdmsRepository
  courierUpdatesRepositoryAlt?: CourierUpdatesRepository
  encrypterAlt?: Encrypter
}) {
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const courierUpdatesRepository =
    props?.courierUpdatesRepositoryAlt ?? new InMemoryCourierUpdatesRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()

  const useCase = new UpdateCourierPasswordUseCase(
    couriersRepository,
    admsRepository,
    courierUpdatesRepository,
    encrypter,
  )

  return {
    useCase,
    dependencies: {
      couriersRepository,
      admsRepository,
      courierUpdatesRepository,
      encrypter,
    },
  }
}
