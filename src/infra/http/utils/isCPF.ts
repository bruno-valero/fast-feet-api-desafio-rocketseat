// import { randint } from './numbers'

export const criaDigitos: (num: string) => string = (num: string) => {
  const arrNum = num.split('')
  const length = arrNum.length

  const digito = arrNum
    .map((letter, index) => {
      const number = Number(letter)
      return number * (length + 1 - index)
    })
    .reduce((acc, num) => acc + num, 0)

  const digitoCalc1 = 11 - (digito % 11)
  const digitoCalc2 = digitoCalc1 > 9 ? '0' : String(digitoCalc1)

  if (arrNum.length === 11) {
    const result = arrNum.join('')
    return result
  }
  const arrNum2 = [...arrNum, digitoCalc2]
  const result = arrNum2.join('')

  return criaDigitos(result)
}

export const formataCPF = (cpf: string) => {
  cpf = String(cpf)
  const parte1 = cpf.slice(0, 3)
  const parte2 = cpf.slice(3, 6)
  const parte3 = cpf.slice(6, 9)
  const digitos = cpf.slice(-2)

  cpf = `${parte1}.${parte2}.${parte3}-${digitos}`
  return cpf
}

export const validaCPF = (text: string) => {
  if (!text) return false
  const cpfClear = text.replaceAll(/\D+/g, '')
  if (cpfClear.length !== 11) return false
  if (cpfClear[0].repeat(cpfClear.length) === cpfClear) return false

  const cpfArray = cpfClear.split('') as string[]
  const cpfFiltered = cpfArray
    .filter((n) => {
      if (!/\W/g.exec(n)) return n
      return false
    })
    .filter((n) => {
      if (Number.isInteger(Number(n))) return n
      return false
    })

  const cpfJoined = cpfFiltered.join('')
  const parte1 = cpfJoined.slice(0, -2)
  const cpfValido = criaDigitos(parte1)

  const cpf = cpfJoined
  return cpf === cpfValido
}
