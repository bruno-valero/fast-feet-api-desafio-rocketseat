import { DataValidationError } from '@/core/errors/errors/data-validation-error'
import { mask } from 'remask'
import z from 'zod'

// eslint-disable-next-line
export const cpfInstanceSchema = z.custom<Cpf>(
  (data) => data instanceof Cpf,
  'must be a valide Cpf',
)

export class Cpf {
  private cpf: string
  constructor(cpf: string) {
    const cpfRaw = cpf.replaceAll(/[a-zA-z\s\W-]+/gi, '')
    const cpfLength = cpfRaw.length
    const correctLength = '00000000000'.length
    if (cpfLength !== correctLength)
      throw new DataValidationError(
        `cpf length must be ${correctLength}, but ${cpfLength} characters was passed`,
      )
    this.cpf = cpf
  }

  get raw() {
    return this.cpf
  }

  get format() {
    return mask(this.cpf, '999.999.999-99')
  }

  equals(cpf: Cpf) {
    return this.raw === cpf.raw
  }
}
