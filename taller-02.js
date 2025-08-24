function findMax(lista) {
  if (lista.length === 0) {
    return null
  }
  let numMax = lista[0]
  for (let index = 1; index < lista.length; index++) {
    if (lista[index] > numMax) {
      numMax = lista[index]
    }
  }
  return numMax
}

function includes(lista, numero) {
  for (let index = 0; index < lista.length; index++) {
    if (numero === lista[index]) {
      return true
    }
  }
  return false
}

function sum(lista) {
  let suma = 0
  for (let index = 0; index < lista.length; index++) {
    suma += lista[index]
  }
  return suma
}

function missingNumbers(lista) {
  if (lista.length < 2) {
    return []
  }
  let numMin = findMin(lista)
  let numMax = findMax(lista)
  let listaFinal = []
  for (let i = numMin + 1; i < numMax; i++) {
    if (!includes(lista, i)) {
      listaFinal.push(i)
    }
  }
  return listaFinal
}

//funcion auxiliar jeje
function findMin(lista) {
  if (lista.length === 0) {
    return null
  }
  let numMin = lista[0]
  for (let index = 1; index < lista.length; index++) {
    if (lista[index] < numMin) {
      numMin = lista[index]
    }
  }
  return numMin
}
