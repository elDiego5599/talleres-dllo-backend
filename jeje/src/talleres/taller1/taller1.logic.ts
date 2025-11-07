export function convertidorTemp(gradosC: number): number {
    const F = (gradosC * 9/5) + 32
    return F
}

export function resolverdor(a: number, b: number, c: number, eleccion: number): number {
    if (eleccion === 1) {
        return (-b + (b**2 - (4*a*c))**(1/2))/2*a
    } else{
        return (-b - (b**2 - (4*a*c))**(1/2))/2*a
    }
}

export function mejorParidad(num: number): boolean {
    return num % 2 === 0
}

export function peorParidad(num: number): boolean {
    const array = []
    for (let index = 0; index < num; index++) {
        array[index] = index
    }
    return array.length % 2 === 0
}