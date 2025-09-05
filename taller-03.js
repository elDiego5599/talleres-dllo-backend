function desglosarString(palabra, tipo) {
  const vocales = "aeiou";
  let contadorVocales = 0;
  let contadorConsonantes = 0;
  
  const palabraMinusculas = palabra.toLowerCase();

  for (let i = 0; i < palabraMinusculas.length; i++) {
    const letra = palabraMinusculas[i];
  
    if (vocales.includes(letra)) {
        contadorVocales++;
      } else {
        contadorConsonantes++;
      }
  }

  if (tipo === "vocales") {
    return contadorVocales;
  } else {
    return contadorConsonantes;
  }
}

function twoSum(lista, entero ) {
    let indices = []
    for (let i = 0; i < lista.length; i++) {
        let num = lista[i]
        for (let j = 0; j < lista.length; j++) {
            if (num + lista[j] === entero && j!==i){
                return [i, j]
            }
        }
    }
}

function conversionRomana(romano) {
  const valores = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  let resultado = 0;
  for (let i = 0; i < romano.length; i++) {
    const actual = valores[romano[i]];
    const siguiente = valores[romano[i + 1]];

    if (siguiente > actual) {
      resultado += siguiente - actual;
      i++;
    } else {
      resultado += actual;
    }
  }
  return resultado;
}

function descomposicion(texto) {
  const partes = texto.split(',');
  const palabraADescomponer = partes[0];
  const diccionario = partes.slice(1);

  for (let i = 1; i < palabraADescomponer.length; i++) {
    const parte1 = palabraADescomponer.substring(0, i);
    const parte2 = palabraADescomponer.substring(i);

    if (diccionario.includes(parte1) && diccionario.includes(parte2)) {
      return [parte1, parte2];
    }
  }

}
