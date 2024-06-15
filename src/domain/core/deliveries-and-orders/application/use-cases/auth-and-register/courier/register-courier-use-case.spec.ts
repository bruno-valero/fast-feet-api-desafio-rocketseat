import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeAdm } from 'test/factories/entities/makeAdm'
import { makeRegisterCourierUseCase } from 'test/factories/use-cases/auth-and-register/make-register-courier-use-case'

describe('register courier use case', () => {
  let sut = makeRegisterCourierUseCase()
  beforeEach(() => {
    sut = makeRegisterCourierUseCase()
  })

  it('should be able to register a new courier', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(couriers).toHaveLength(1)
    expect(couriers[0]).toEqual(
      expect.objectContaining({
        name: 'bruno',
      }),
    )
  })

  it('should be able to encrypt the courier on registration', async () => {
    await sut.dependencies.admsRepository.create(makeAdm())

    const adm = (await sut.dependencies.admsRepository.findMany())[0]

    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: adm.id.value,
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isRight()).toBeTruthy()
    expect(couriers).toHaveLength(1)
    expect(
      await sut.dependencies.encrypter.compare('123', couriers[0].password),
    ).toEqual(true)
  })

  it('should not be able to register a new courier if the action is not made by an adm', async () => {
    const sutResp = await sut.useCase.execute({
      cpf: '44411166677',
      name: 'bruno',
      password: '123',
      requestResponsibleId: 'any id',
    })

    const couriers = await sut.dependencies.couriersRepository.findMany()

    expect(sutResp.isLeft()).toBeTruthy()
    expect(sutResp.value).toBeInstanceOf(ResourceNotFoundError)
    expect(couriers).toHaveLength(0)
  })
})
