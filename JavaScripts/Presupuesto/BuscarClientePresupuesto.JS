import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async function () {
    // ELEMENTOS PARA CLIENTE
    const inputBuscarCliente = document.getElementById('buscarCliente');
    const listaCoincidenciasClientes = document.getElementById('listaCoincidenciasClientes');
    const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');

    let clientesFiltrados = []; // Array para almacenar los clientes disponibles

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuario no autenticado. Por favor, inicie sesión.');

        const userId = obtenerUserIdDesdeToken(token);

        // Obtener sucursales asociadas al usuario
        const sucursalIds = await obtenerSucursalesUsuario(userId, token);

        // Obtener clientes y filtrar según las sucursales
        clientesFiltrados = await obtenerClientesPorSucursal(sucursalIds);
        console.log('✅ Clientes filtrados cargados:', clientesFiltrados);

    } catch (error) {
        console.error('❌ Error al cargar los clientes:', error);
        alert('Error al cargar los clientes. Por favor, intente nuevamente.');
        return;
    }

    // Manejo de la búsqueda de clientes
    inputBuscarCliente.addEventListener('input', function () {
        const filtro = this.value.toLowerCase().trim();
        listaCoincidenciasClientes.innerHTML = ''; // Limpiar coincidencias previas

        if (filtro.length === 0) return; // No hacer nada si el campo está vacío

        // Filtrar por nombre o RUT
        const coincidencias = clientesFiltrados.filter(cliente =>
            cliente.nom_cliente.toLowerCase().includes(filtro) ||
            cliente.rut_cliente.replace(/\./g, '').replace(/-/g, '').toLowerCase().includes(filtro)
        );

        // Mostrar coincidencias en la lista
        coincidencias.forEach(cliente => {
            const item = document.createElement('a');
            item.href = '#';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.textContent = `${cliente.nom_cliente} (${cliente.rut_cliente})`;
            item.addEventListener('click', function (e) {
                e.preventDefault();
                seleccionarCliente(cliente);
            });
            listaCoincidenciasClientes.appendChild(item);
        });
    });

    // Función para seleccionar un cliente
    function seleccionarCliente(cliente) {
        inputClienteSeleccionado.value = cliente.rut_cliente; // Agregar RUT del cliente
        listaCoincidenciasClientes.innerHTML = ''; // Limpiar coincidencias
        inputBuscarCliente.value = ''; // Limpiar campo de búsqueda
    }

    // Limpiar la selección de cliente cuando se cierre el modal
    $('#agregarPresupuestomodal').on('hidden.bs.modal', function () {
        inputClienteSeleccionado.value = '';
        inputBuscarCliente.value = '';
        listaCoincidenciasClientes.innerHTML = '';
    });

    // 📌 Función para obtener el ID del usuario desde el token JWT
    function obtenerUserIdDesdeToken(token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.id;
        } catch (error) {
            throw new Error("Error al decodificar el token.");
        }
    }

    // 📌 Función para obtener las sucursales del usuario
    async function obtenerSucursalesUsuario(userId, token) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Error al obtener las sucursales del usuario.");
            const sucursales = await response.json();
            return sucursales.map(sucursal => sucursal.id_sucursal);
        } catch (error) {
            console.error("❌ Error al obtener las sucursales:", error);
            throw error;
        }
    }

    // 📌 Función para obtener clientes filtrados por sucursales
    async function obtenerClientesPorSucursal(sucursalIds) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/clientes`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Error al obtener la lista de clientes.");
            const clientes = await response.json();
            return clientes.filter(cliente => sucursalIds.includes(cliente.id_sucursal));
        } catch (error) {
            console.error("❌ Error al obtener clientes:", error);
            throw error;
        }
    }
});
