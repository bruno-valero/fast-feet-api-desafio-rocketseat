import { Encoder } from '@/domain/core/deliveries-and-orders/application/cryptography/encoder'
import { Encrypter } from '@/domain/core/deliveries-and-orders/application/cryptography/encrypter'
import { AuthenticateAdmUseCase } from '@/domain/core/deliveries-and-orders/application/use-cases/auth-and-register/adm/authenticate-adm-use-case'
import { InMemoryAdmsRepository } from 'test/repositories/adm-in-memory-repositories/in-memory-adms-repository'
import { FakeEncrypter } from '../../cryptography/fake-cryptography.ts/fake-encripter'
import { FakeEncoder } from '../../cryptography/fake-cryptography.ts/fake-encoder'
import { AdmsRepository } from '@/domain/core/deliveries-and-orders/application/repositories/adm-repositories/adms-repository'

export function makeAuthenticateAdmUseCase(props?: {
  admsRepositoryAlt?: AdmsRepository
  encrypterAlt?: Encrypter
  encoderAlt?: Encoder
}) {
  const admsRepository =
    props?.admsRepositoryAlt ?? new InMemoryAdmsRepository()
  const encrypter = props?.encrypterAlt ?? new FakeEncrypter()
  const encoder = props?.encoderAlt ?? new FakeEncoder()

  const useCase = new AuthenticateAdmUseCase(admsRepository, encrypter, encoder)

  return {
    useCase,
    dependencies: {
      admsRepository,
      encrypter,
      encoder,
    },
  }
}
