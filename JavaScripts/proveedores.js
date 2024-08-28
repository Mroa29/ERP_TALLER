
// Función para validar el RUT chileno
function validarRut(rut) {
    // Eliminar puntos, guiones y convertir todo a mayúsculas
    rut = rut.replace(/[.-]/g, '').toUpperCase();

    // Verificar que tenga un formato válido
    if (!/^[0-9]+[K0-9]$/.test(rut)) {
        return false;
    }

    // Obtener el número y el dígito verificador
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);

    // Calcular el dígito verificador
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * parseInt(cuerpo.charAt(i));
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dvEsperado === dv;
}

// Función para ocultar todas las tablas
function hideAllTables() {
    Object.values(tables).forEach(tableId => {
        document.getElementById(tableId).classList.add('hidden-table');
    });
}

// Manejador para agregar proveedor
document.getElementById('btnagregarproveedor').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    // Obtener los valores de los campos del formulario
    const rut = document.getElementById('rut').value.trim();
    const razonSocial = document.getElementById('razonsocial').value.trim();
    const giro = document.getElementById('giro').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const tipoProveedor = document.getElementById('tipoproveedor').value;
    
    // Validar los campos requeridos
    if (!rut || !razonSocial) {
        document.getElementById('mensajeError').innerText = 'Por favor, complete los campos requeridos (RUT y Razón Social).';
        document.getElementById('mensajeError').style.display = 'block';
        return;
    }

    // Validar el RUT chileno
    if (!validarRut(rut)) {
        document.getElementById('mensajeError').innerText = 'El RUT ingresado no es válido.';
        document.getElementById('mensajeError').style.display = 'block';
        return;
    }

    // Si no hay errores, ocultamos el mensaje de error
    document.getElementById('mensajeError').style.display = 'none';
    
    // Obtener el cuerpo de la tabla donde se agregarán las filas
    const tbody = document.querySelector('#tablalistadoproovedores tbody');
    
    // Crear una nueva fila
    const newRow = document.createElement('tr');
    
    // Crear las celdas de la fila con los valores ingresados
    newRow.innerHTML = `
        <td>${razonSocial}</td>
        <td>${rut}</td>
        <td>${giro}</td>
        <td>${correo}</td>
        <td>${tipoProveedor}</td>
        <td><button class="btn btn-info btn-sm">Ver</button></td>
    `;
    
    // Agregar la nueva fila a la tabla
    tbody.appendChild(newRow);
    
    // Limpiar el formulario después de agregar el proveedor
    document.getElementById('idformagregarproveedor').reset();

    // Forzar el cierre del modal
    $('#editarProveedorModalLabel').closest('.modal').modal('hide');
    
    // Solución para casos donde el modal queda semi-abierto
    $('body').removeClass('modal-open'); // Eliminar la clase que bloquea el scroll
    $('.modal-backdrop').remove(); // Eliminar el backdrop (pantalla oscurecida)
});

// Funcionalidad para mostrar/ocultar tablas
const tables = {
    totalComprasCard: 'comprasTable',
    totalPagadoCard: 'pagadoTable',
    pendientePagoCard: 'pendienteTable'
};

Object.keys(tables).forEach(cardId => {
    document.getElementById(cardId).addEventListener('click', function() {
        hideAllTables();
        document.getElementById(tables[cardId]).classList.remove('hidden-table');
    });
});

