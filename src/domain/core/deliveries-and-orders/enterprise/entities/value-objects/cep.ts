import { DataValidationError } from '@/core/errors/errors/data-validation-error'
import { mask } from 'remask'
import z from 'zod'

// eslint-disable-next-line
export const cepInstanceSchema = z.custom<Cep>(
  (data) => data instanceof Cep,
  'must be a valide Cep',
)

export class Cep {
  private cep: string
  constructor(cep: string) {
    const cepRaw = cep.replaceAll(/[a-zA-z\s\W-]+/gi, '')
    const cepLength = cepRaw.length
    const correctLength = '00000000'.length
    if (cepLength !== correctLength)
      throw new DataValidationError(
        `cep length must be ${correctLength}, but ${cepLength} characters was passed`,
      )
    this.cep = cep
  }

  get raw() {
    return this.cep
  }

  get format() {
    return mask(this.cep, '99999-999')
  }

  equals(cep: Cep) {
    return this.raw === cep.raw
  }
}
