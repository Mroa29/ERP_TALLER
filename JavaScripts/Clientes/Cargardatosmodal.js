import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Usuario no autenticado. Por favor, inicie sesión.');
            window.location.href = "/login";
            return;
        }

        let decodedToken;
        try {
            decodedToken = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            alert('Sesión inválida. Inicie sesión nuevamente.');
            localStorage.removeItem('token');
            window.location.href = "/login";
            return;
        }

        const userId = decodedToken.id;

        const modals = [
            {
                tipoClienteSelect: document.getElementById('tipoCliente'),
                estadoClienteSelect: document.getElementById('estadoCliente'),
                sucursalClienteSelect: document.getElementById('sucursalCliente'),
            },
            {
                tipoClienteSelect: document.getElementById('clienteAuto_tipoCliente'),
                estadoClienteSelect: document.getElementById('clienteAuto_estadoCliente'),
                sucursalClienteSelect: document.getElementById('clienteAuto_sucursalCliente'),
                tipoVehiculoSelect: document.getElementById('vehiculo_tipo'),
            },
        ];

        for (const modal of modals) {
            const { tipoClienteSelect, estadoClienteSelect, sucursalClienteSelect, tipoVehiculoSelect } = modal;

            if (!tipoClienteSelect || !estadoClienteSelect || !sucursalClienteSelect) {
                throw new Error('No se encontraron los elementos para los selects en uno de los modales.');
            }

            // Limpiar selects para evitar duplicados
            [tipoClienteSelect, estadoClienteSelect, sucursalClienteSelect, tipoVehiculoSelect].forEach((select) => {
                if (select) select.innerHTML = '<option value="">Seleccione una opción</option>';
            });

            // Obtener y rellenar tipos de cliente
            const tiposClientes = await fetchData(`${CONFIG.API_BASE_URL}/api/clientes/tipos`);
            tiposClientes.forEach((tipo) => {
                const option = document.createElement('option');
                option.value = tipo.id_tipo_cliente;
                option.textContent = tipo.descripcion;
                tipoClienteSelect.appendChild(option);
            });

            // Obtener y rellenar estados de cliente
            const estadosClientes = await fetchData(`${CONFIG.API_BASE_URL}/api/clientes/estados`);
            estadosClientes.forEach((estado) => {
                const option = document.createElement('option');
                option.value = estado.id_estado_cliente;
                option.textContent = estado.descripcion;
                estadoClienteSelect.appendChild(option);
            });

            // Obtener y rellenar sucursales del usuario
            const sucursales = await fetchData(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
                Authorization: `Bearer ${token}`,
            });
            sucursales.forEach((sucursal) => {
                const option = document.createElement('option');
                option.value = sucursal.id_sucursal;
                option.textContent = sucursal.nombre_sucursal;
                sucursalClienteSelect.appendChild(option);
            });

            // Rellenar tipos de vehículo (solo en el modal correspondiente)
            if (tipoVehiculoSelect) {
                const tiposVehiculos = await fetchData(`${CONFIG.API_BASE_URL}/api/vehiculos/tipos`);
                tiposVehiculos.forEach((tipoVehiculo) => {
                    const option = document.createElement('option');
                    option.value = tipoVehiculo.id_tipo_vehiculo;
                    option.textContent = tipoVehiculo.descripcion;
                    tipoVehiculoSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar los datos para los selects:', error.message);
        alert('Hubo un problema al cargar los datos. Intente nuevamente.');
    }
});

// Función reutilizable para `fetch()`
async function fetchData(url, headers = {}) {
    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener los datos de ${url}:`, error.message);
        return [];
    }
}
