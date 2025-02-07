import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#tablalistadoclientes tbody');

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Usuario no autenticado. Por favor, inicie sesión.');
            window.location.href = "/login";
            return;
        }

        // Decodificar el token para obtener el ID del usuario
        let decodedToken;
        try {
            decodedToken = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            alert('Error con la sesión. Por favor, inicie sesión nuevamente.');
            localStorage.removeItem('token');
            window.location.href = "/login";
            return;
        }

        const userId = decodedToken.id;

        // Obtener sucursales del usuario
        const sucursalesResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!sucursalesResponse.ok) {
            console.error(`Error ${sucursalesResponse.status}: No se pudieron obtener las sucursales`);
            throw new Error('Error al obtener las sucursales del usuario.');
        }

        const sucursales = await sucursalesResponse.json();
        const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);

        // Obtener clientes
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/clientes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.error(`Error ${response.status}: No se pudieron obtener los clientes`);
            throw new Error('Error al obtener los clientes.');
        }

        const clientes = await response.json();
        const clientesFiltrados = clientes.filter(cliente => sucursalIds.includes(cliente.id_sucursal));

        // Insertar clientes en la tabla
        for (const cliente of clientesFiltrados) {
            // Obtener descripción del tipo de cliente
            const tipoClienteResponse = await fetch(`${CONFIG.API_BASE_URL}/api/clientes/tipos/${cliente.id_tipo_cliente}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            let tipoClienteDescripcion = 'Desconocido';

            if (tipoClienteResponse.ok) {
                const tipoCliente = await tipoClienteResponse.json();
                tipoClienteDescripcion = tipoCliente.descripcion;
            }

            // Crear fila
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.rut_cliente}</td>
                <td>${cliente.nom_cliente}</td>
                <td>${tipoClienteDescripcion}</td>
                <td>${cliente.email_cliente}</td>
                <td>${cliente.telefono_cliente}</td>
                <td>
                    <button class="btn btn-primary btn-sm btn-ver-cliente" data-rut="${cliente.rut_cliente}">
                        <i class="fas fa-search"></i> Ver
                    </button>
                    <button class="btn btn-warning btn-sm btn-editar-cliente" data-rut="${cliente.rut_cliente}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        }

        // Manejo de botones "Ver"
        document.querySelectorAll('.btn-ver-cliente').forEach((button) => {
            button.addEventListener('click', async () => {
                const rutCliente = button.getAttribute('data-rut');

                try {
                    const clienteResponse = await fetch(`${CONFIG.API_BASE_URL}/api/clientes/${rutCliente}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!clienteResponse.ok) {
                        throw new Error('Error al obtener la información del cliente.');
                    }

                    const clienteData = await clienteResponse.json();

                    // Actualizar modal
                    document.getElementById('modalClienteRut').textContent = clienteData.rut_cliente;
                    document.getElementById('modalClienteNombre').textContent = clienteData.nom_cliente;
                    document.getElementById('modalClienteTipo').textContent = clienteData.id_tipo_cliente;
                    document.getElementById('modalClienteTelefono').textContent = clienteData.telefono_cliente || 'No especificado';
                    document.getElementById('modalClienteEmail').textContent = clienteData.email_cliente || 'No especificado';
                    document.getElementById('modalClienteEstado').textContent = clienteData.id_estado_cliente;
                    document.getElementById('modalClienteDireccion').textContent = clienteData.direccion_cliente || 'No especificado';
                    document.getElementById('modalClienteComuna').textContent = clienteData.comuna_cliente || 'No especificado';
                    document.getElementById('modalClienteCiudad').textContent = clienteData.ciudad_cliente || 'No especificado';
                    document.getElementById('modalClientePais').textContent = clienteData.pais_cliente || 'No especificado';
                    document.getElementById('modalClienteObservaciones').textContent = clienteData.obs_cliente || 'No especificado';

                    // Mostrar modal
                    const modalElement = document.getElementById('modalVerCliente');
                    if (modalElement) {
                        const modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    }
                } catch (error) {
                    console.error('Error al obtener el cliente:', error);
                    alert('Error al mostrar el cliente.');
                }
            });
        });

    } catch (error) {
        console.error('Error general:', error);
        alert('Hubo un problema al cargar los clientes.');
    }
});
