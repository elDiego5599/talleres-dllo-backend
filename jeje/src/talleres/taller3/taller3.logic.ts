export function desglosarString(palabra: string, tipo: string): number {
    const vocales = "aeiou"
    let contadorVocales = 0
    let contadorConsonantes = 0
    
    const palabraMinusculas = palabra.toLowerCase()
  
    for (let i = 0; i < palabraMinusculas.length; i++) {
      const letra = palabraMinusculas[i]
    
      if (typeof letra === 'string' && vocales.includes(letra)) {
          contadorVocales++
        } else if (typeof letra === 'string' && letra >= 'a' && letra <= 'z') {
          contadorConsonantes++
        }
    }
  
    if (tipo === "vocales") {
      return contadorVocales
    } else {
      return contadorConsonantes
    }
}
  
export function twoSum(lista: number[], entero: number): number[] | undefined {
    for (let i = 0; i < lista.length; i++) {
        let num = lista[i]
        if (typeof num !== 'number') continue
        for (let j = 0; j < lista.length; j++) {
            if (typeof lista[j] === 'number' && num + (lista[j] as number) === entero && j !== i){
                return [i, j]
            }
        }
    }
}

export function conversionRomana(romano: string): number {
    const valores: { [key: string]: number } = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    }
  
    let resultado = 0
    romano = romano.toUpperCase()
    for (let i = 0; i < romano.length; i++) {
      const charActual = romano[i]
      const charSiguiente = romano[i + 1]
      if (!charActual || !(charActual in valores)) continue
      const actual = valores[charActual] as number
      let siguiente: number | undefined = undefined
      if (charSiguiente && charSiguiente in valores) {
        siguiente = valores[charSiguiente]
      }
      if (siguiente !== undefined && siguiente > actual) {
        resultado += siguiente - actual
        i++
      } else {
        resultado += actual
      }
    }
    return resultado
}

export function descomposicion(texto: string): string[] | undefined {
    const partes = texto.split(',')
    const palabraADescomponer = partes[0]
    if (typeof palabraADescomponer !== 'string') return undefined
    const diccionario = partes.slice(1)
  
    for (let i = 1; i < palabraADescomponer.length; i++) {
      const parte1 = palabraADescomponer.substring(0, i)
      const parte2 = palabraADescomponer.substring(i)
  
      if (diccionario.includes(parte1) && diccionario.includes(parte2)) {
        return [parte1, parte2]
      }
    }
}