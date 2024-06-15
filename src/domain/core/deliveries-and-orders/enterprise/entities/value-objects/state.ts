export type StatesShort =
  | 'AM'
  | 'PA'
  | 'RR'
  | 'AP'
  | 'AC'
  | 'RO'
  | 'TO'
  | 'MA'
  | 'PI'
  | 'CE'
  | 'RN'
  | 'PB'
  | 'PE'
  | 'AL'
  | 'SE'
  | 'BA'
  | 'MG'
  | 'ES'
  | 'RJ'
  | 'SP'
  | 'PR'
  | 'SC'
  | 'RS'
  | 'MS'
  | 'MT'
  | 'GO'
  | 'DF'
type StatesVerbose =
  | 'Amazonas'
  | 'Pará'
  | 'Roraima'
  | 'Amapá'
  | 'Acre'
  | 'Rondônia'
  | 'Tocantins'
  | 'Maranhão'
  | 'Piauí'
  | 'Ceará'
  | 'Rio Grande do Norte'
  | 'Paraíba'
  | 'Pernambuco'
  | 'Alagoas'
  | 'Sergipe'
  | 'Bahia'
  | 'Minas Gerais'
  | 'Espírito Santo'
  | 'Rio de Janeiro'
  | 'São Paulo'
  | 'Paraná'
  | 'Santa Catarina'
  | 'Rio Grande do Sul'
  | 'Mato Grosso do Sul'
  | 'Mato Grosso'
  | 'Goiás'
  | 'Distrito Federal'

export class State {
  private state: StatesShort

  constructor(state: StatesShort) {
    this.state = state
  }

  private shortToVerboseMapper(state: StatesShort): StatesVerbose {
    const mapper: Record<StatesShort, StatesVerbose> = {
      AM: 'Amazonas',
      PA: 'Pará',
      RR: 'Roraima',
      AP: 'Amapá',
      AC: 'Acre',
      RO: 'Rondônia',
      TO: 'Tocantins',
      MA: 'Maranhão',
      PI: 'Piauí',
      CE: 'Ceará',
      RN: 'Rio Grande do Norte',
      PB: 'Paraíba',
      PE: 'Pernambuco',
      AL: 'Alagoas',
      SE: 'Sergipe',
      BA: 'Bahia',
      MG: 'Minas Gerais',
      ES: 'Espírito Santo',
      RJ: 'Rio de Janeiro',
      SP: 'São Paulo',
      PR: 'Paraná',
      SC: 'Santa Catarina',
      RS: 'Rio Grande do Sul',
      MS: 'Mato Grosso do Sul',
      MT: 'Mato Grosso',
      GO: 'Goiás',
      DF: 'Distrito Federal',
    }

    return mapper[state]
  }

  get short(): StatesShort {
    return this.state
  }

  get verbose(): StatesVerbose {
    return this.shortToVerboseMapper(this.state)
  }

  equals(state: State) {
    return this.short === state.short
  }
}
