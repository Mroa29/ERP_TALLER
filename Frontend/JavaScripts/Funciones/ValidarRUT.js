export default function validarRUT(rut) {
    // Eliminar los puntos y guion del rut
    rut = rut.replace(/[.\-]/g, '');
    
    // Verificar que tenga un largo mínimo
    if (rut.length < 8 || rut.length > 9) {
        return false;
    }
    
    // Separar el número del dígito verificador
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    
    // Verificar que el cuerpo sea numérico
    if (!/^\d+$/.test(cuerpo)) {
        return false;
    }
    
    // Calcular el dígito verificador
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const resto = 11 - (suma % 11);
    let dvEsperado;
    
    if (resto === 11) {
        dvEsperado = '0';
    } else if (resto === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = resto.toString();
    }
    
    // Retornar si el dígito verificador coincide
    return dv === dvEsperado;
}
