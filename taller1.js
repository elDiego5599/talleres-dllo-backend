function convertidorTemp(gradosC) {
    let F = (gradosC * 9/5) + 32
    return F
}

function resolverdor(a, b, c, eleccion) {

    if (eleccion === 1) {
    return (-b + (b**2 - (4*a*c))**(1/2))/2*a
    } else{
    return (-b - (b**2 - (4*a*c))**(1/2))/2*a
    }
}

function mejorParidad(num) {

    return num % 2 === 0
}

function peorParidad(num) {

    let array = []

    for (let index = 0; index < num; index++) {
        array[index] = index
    }

    return array.length % 2 === 0
}
