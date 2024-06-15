import { DataValidationError } from '@/core/errors/errors/data-validation-error'
import { mask } from 'remask'

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
