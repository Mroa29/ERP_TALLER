document.addEventListener('DOMContentLoaded', async function () {
    const inputBuscarCliente = document.getElementById('buscarCliente');
    const listaCoincidencias = document.getElementById('listaCoincidenciasClientes');
    const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');
    const btnAgregarVehiculo = document.getElementById('btnagregarvehiculo');
    let clientesFiltrados = []; // Lista para almacenar los clientes dinámicamente

    try {
        // Obtener el token y validar autenticación
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuario no autenticado. Por favor, inicie sesión.');

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Obtener las sucursales asociadas al usuario
        const sucursalesResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}/sucursales`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!sucursalesResponse.ok) throw new Error('Error al obtener las sucursales del usuario.');

        const sucursales = await sucursalesResponse.json();
        const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);

        // Obtener la lista de clientes
        const clientesResponse = await fetch('http://localhost:3000/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!clientesResponse.ok) throw new Error('Error al obtener los clientes.');

        const clientes = await clientesResponse.json();
        // Filtrar clientes por las sucursales asociadas al usuario
        clientesFiltrados = clientes.filter(cliente => sucursalIds.includes(cliente.id_sucursal));

        console.log('Clientes filtrados cargados:', clientesFiltrados);
    } catch (error) {
        console.error('Error al cargar los clientes:', error);
        alert('Error al cargar los datos. Por favor, intente nuevamente.');
        return;
    }

    // Función para manejar la búsqueda de clientes
    inputBuscarCliente.addEventListener('input', function () {
        const filtro = this.value.toLowerCase().trim();
        listaCoincidencias.innerHTML = ''; // Limpiar la lista de coincidencias

        if (filtro.length === 0) return; // No buscar si el campo está vacío

        // Filtrar clientes por nombre o RUT
        const coincidencias = clientesFiltrados.filter(cliente =>
            cliente.nom_cliente.toLowerCase().includes(filtro) ||
            cliente.rut_cliente.replace(/\./g, '').replace(/-/g, '').toLowerCase().includes(filtro)
        );

        // Mostrar las coincidencias
        coincidencias.forEach(cliente => {
            const item = document.createElement('a');
            item.href = '#';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.textContent = `${cliente.nom_cliente} (${cliente.rut_cliente})`;
            item.addEventListener('click', function (e) {
                e.preventDefault();
                seleccionarCliente(cliente);
            });
            listaCoincidencias.appendChild(item);
        });
    });

    // Función para seleccionar un cliente
    function seleccionarCliente(cliente) {
        inputClienteSeleccionado.value = cliente.rut_cliente; // Agregar el RUT del cliente al campo
        btnAgregarVehiculo.disabled = false; // Habilitar el botón de agregar vehículo
        listaCoincidencias.innerHTML = ''; // Limpiar la lista de coincidencias
        inputBuscarCliente.value = ''; // Limpiar el campo de búsqueda
    }

    // Limpiar selección y deshabilitar botón cuando se cierra el modal
    $('#agregarvehiculomodal').on('hidden.bs.modal', function () {
        inputClienteSeleccionado.value = '';
        btnAgregarVehiculo.disabled = true;
        listaCoincidencias.innerHTML = '';
    });
});
