export function findMax(lista: number[]): number | null {
  if (lista.length === 0) {
    return null
  }
  let numMax = lista[0]!
  for (let index = 1; index < lista.length; index++) {
    if (lista[index]! > numMax!) {
      numMax = lista[index]!
    }
  }
  return numMax!
}

export function includes(lista: number[], numero: number): boolean {
  for (let index = 0; index < lista.length; index++) {
    if (numero === lista[index]!) {
      return true
    }
  }
  return false
}

export function sum(lista: number[]): number {
  let suma = 0
  for (let index = 0; index < lista.length; index++) {
    suma += lista[index]!
  }
  return suma
}

export function missingNumbers(lista: number[]): number[] {
  if (lista.length < 2) {
    return []
  }
  let numMin = findMin(lista)
  let numMax = findMax(lista)
  let listaFinal = []
  if (numMin === null || numMax === null) return []
  for (let i = numMin + 1; i < numMax; i++) {
    if (!includes(lista, i)) {
      listaFinal.push(i)
    }
  }
  return listaFinal
}

//funcion auxiliar jeje
export function findMin(lista: number[]): number | null {
  if (lista.length === 0) {
    return null
  }
  let numMin = lista[0]!
  for (let index = 1; index < lista.length; index++) {
    if (lista[index]! < numMin!) {
      numMin = lista[index]!
    }
  }
  return numMin!
}