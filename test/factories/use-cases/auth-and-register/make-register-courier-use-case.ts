import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'
import { CouriersRepository } from '@/domain/core/deliveries-and-orders/application/repositories/courier-repositories/courier-repository'
import { RegisterCourierUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/courier/register-courier-use-case'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { InMemoryCouriersRepository } from 'test/repositories/courier-in-memory-repositories/in-memory-couriers-repository'
import { FakeEncrypter } from '../../cryptography/fake-cryptography.ts/fake-encripter'

export function makeRegisterCourierUseCase(props?: {
  couriersRepositoryAlt?: CouriersRepository
  admsRepositoryAlt?: AdmsRepository
  encrypterAlt?: Encrypter
}) {
  const couriersRepository =
    props?.couriersRepositoryAlt ?? new InMemoryCouriersRepository()
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()

  const useCase = new RegisterCourierUseCase(
    couriersRepository,
    admsRepository,
    encrypter,
  )

  return {
    useCase,
    dependencies: {
      couriersRepository,
      admsRepository,
      encrypter,
    },
  }
}
