import { ValueObject } from '@/core/entities/value-objects'
import { Cep } from './cep'
import { Coordinates } from './coordinates'
import { State, StatesShort } from './state'

export interface AddressProps {
  coordinates: Coordinates
  cep: string
  number: string
  street: string
  neighborhood: string
  city: string
  state: StatesShort
}

export type AddressCreationProps = Omit<AddressProps, 'coordinates'> & {
  coordinates: Coordinates['raw']
}

export type AddressRaw = {
  coordinates: Coordinates['raw']
  cep: string
  number: string
  street: string
  neighborhood: string
  city: string
  state: StatesShort
}

export class Address extends ValueObject<AddressProps> {
  constructor(props: AddressCreationProps) {
    super({
      ...props,
      coordinates: new Coordinates(props.coordinates),
    })
  }

  get coordinates() {
    return this.props.coordinates
  }

  get cep() {
    return new Cep(this.props.cep)
  }

  get number() {
    return this.props.number
  }

  get street() {
    return this.props.street
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get state() {
    return new State(this.props.state)
  }

  get raw() {
    return <AddressRaw>{
      coordinates: this.coordinates.raw,
      cep: this.cep.format,
      number: this.number,
      street: this.street,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state.short,
    }
  }

  get plainText() {
    const raw = this.raw
    return `${raw.street}, ${raw.number}, ${raw.neighborhood}, ${raw.city}-${raw.state}`
  }

  equals(address: Address) {
    const coordinatesEquals = this.coordinates.equals(address.coordinates)
    const cepEqual = this.cep.equals(address.cep)
    const numberEqual = this.number === address.number
    const streetEqual = this.street === address.street
    const neighborhoodEqual = this.neighborhood === address.neighborhood
    const cityEqual = this.city === address.city
    const stateEqual = this.state.equals(address.state)

    const addressEqual =
      coordinatesEquals &&
      cepEqual &&
      numberEqual &&
      streetEqual &&
      neighborhoodEqual &&
      cityEqual &&
      stateEqual

    return addressEqual
  }
}
