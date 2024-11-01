document.addEventListener('DOMContentLoaded', function() {
    const clientes = [
        { numero: 1, rut: "12345678-9", nombre: "Juan Pérez", tipo: "Particular" },
        { numero: 2, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 3, rut: "13579246-8", nombre: "Bruno Cadiz", tipo: "Independiente" },
    ];

    const inputBuscarCliente = document.getElementById('buscarCliente');
    const listaCoincidencias = document.getElementById('listaCoincidenciasClientes');
    const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');
    const btnAgregarVehiculo = document.getElementById('btnagregarvehiculo');
    const mensajeErrorVehiculo = document.getElementById('mensajeErrorVehiculo');
    const tablaVehiculos = document.getElementById('tablalistadovheiculos').querySelector('tbody');
    const tablaHistorial = document.querySelector('.table-striped tbody'); // Selección de la tabla de historial

    // Función para obtener la fecha y hora actual formateada
    function obtenerFechaActual() {
        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0]; // yyyy-mm-dd
        const tiempo = ahora.toLocaleTimeString(); // hh:mm:ss AM/PM
        return `${fecha} ${tiempo}`;
    }

    // Evento al escribir en el campo de búsqueda de cliente
    inputBuscarCliente.addEventListener('input', function() {
        const filtro = this.value.toLowerCase().trim();
        listaCoincidencias.innerHTML = ''; // Limpiamos la lista de coincidencias

        if (filtro.length === 0) {
            return; // No hacer nada si el campo está vacío
        }

        // Filtrar clientes por nombre o RUT
        const coincidencias = clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(filtro) || 
            cliente.rut.replace(/\./g, '').replace(/-/g, '').toLowerCase().includes(filtro)
        );

        // Mostrar las coincidencias
        coincidencias.forEach(cliente => {
            const item = document.createElement('a');
            item.href = '#';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.textContent = `${cliente.nombre} (${cliente.rut})`;
            item.addEventListener('click', function(e) {
                e.preventDefault();
                seleccionarCliente(cliente);
            });
            listaCoincidencias.appendChild(item);
        });
    });

    // Función para seleccionar un cliente
    function seleccionarCliente(cliente) {
        inputClienteSeleccionado.value = `${cliente.nombre} (${cliente.rut})`;
        btnAgregarVehiculo.disabled = false; // Habilitar el botón de agregar vehículo
        listaCoincidencias.innerHTML = ''; // Limpiar la lista de coincidencias
        inputBuscarCliente.value = ''; // Limpiar el campo de búsqueda
    }

    // Evento para agregar vehículo
    btnAgregarVehiculo.addEventListener('click', function(event) {
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        const patente = document.getElementById('vehiculoPlaca').value.trim();
        const clienteSeleccionado = document.getElementById('clienteSeleccionado').value.trim();
        const marca = document.getElementById('vehiculoMarca').value.trim();
        const modelo = document.getElementById('vehiculoModelo').value.trim();
        const kilometraje = document.getElementById('vehiculoKilometraje').value.trim();
        const anio = document.getElementById('vehiculoAnio').value.trim();

        // Validar que todos los campos requeridos estén completos
        if (!patente || !clienteSeleccionado || !marca || !modelo || !kilometraje || !anio) {
            mensajeErrorVehiculo.innerText = 'Todos los campos son obligatorios. Por favor, complete el formulario.';
            mensajeErrorVehiculo.style.display = 'block'; // Mostrar mensaje de error
            return; // Salir de la función si hay un error
        }

        // Ocultar el mensaje de error si todo está correcto
        mensajeErrorVehiculo.style.display = 'none';

        // Crear una nueva fila para la tabla de vehículos
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${patente}</td>
            <td>${clienteSeleccionado}</td>
            <td>${marca}</td>
            <td>${modelo}</td>
            <td>${kilometraje}</td>
            <td>${anio}</td>
            <td>
                <button class="btn btn-info btn-sm">
                    <i class="fas fa-search"></i>
                </button>
            </td>
        `;

        // Agregar la nueva fila a la tabla
        tablaVehiculos.appendChild(nuevaFila);

        // Agregar una nueva fila al historial
        const nuevaFilaHistorial = document.createElement('tr');
        const fechaActual = obtenerFechaActual(); // Obtener la fecha y hora actual
        nuevaFilaHistorial.innerHTML = `
            <td>${tablaHistorial.getElementsByTagName('tr').length + 1}</td>
            <td>${marca} ${modelo} ${anio}</td>
            <td><span class="badge bg-success">Agregado</span></td>
            <td>${fechaActual}</td>
            <td>Juan Pérez</td> <!-- Este valor es estático, puedes modificarlo para que sea dinámico -->
            <td>Vehículo agregado al sistema</td>
        `;
        tablaHistorial.appendChild(nuevaFilaHistorial);

        // Limpiar el formulario
        document.getElementById('idformagregarvehiculo').reset();
        inputClienteSeleccionado.value = ''; // Limpiar la selección del cliente
        btnAgregarVehiculo.disabled = true; // Deshabilitar el botón de agregar vehículo

        // Cerrar el modal manualmente
        $('#agregarvehiculomodal').modal('hide').on('hidden.bs.modal', function () {
            $('.modal-backdrop').remove(); // Forzar la eliminación del backdrop si es necesario
        });
    });

    // Evento para limpiar selección y mensaje de error si se cierra el modal
    $('#agregarvehiculomodal').on('hidden.bs.modal', function () {
        mensajeErrorVehiculo.style.display = 'none'; // Ocultar el mensaje de error
        inputClienteSeleccionado.value = ''; // Limpiar la selección de cliente
        btnAgregarVehiculo.disabled = true; // Deshabilitar el botón de agregar vehículo
    });
});
