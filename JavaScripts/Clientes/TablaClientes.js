document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#tablalistadoclientes tbody');

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Usuario no autenticado. Por favor, inicie sesión.');
        }

        // Decodificar el token para obtener el ID del usuario
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

        if (!sucursalesResponse.ok) {
            throw new Error('Error al obtener las sucursales del usuario.');
        }

        const sucursales = await sucursalesResponse.json();
        const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);

        // Obtener los clientes
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los clientes.');
        }

        const clientes = await response.json();

        // Filtrar los clientes por las sucursales asociadas al usuario
        const clientesFiltrados = clientes.filter(cliente => sucursalIds.includes(cliente.id_sucursal));

        // Iterar sobre los clientes filtrados para mostrarlos en la tabla
        for (const cliente of clientesFiltrados) {
            // Obtener la descripción del tipo de cliente
            const tipoClienteResponse = await fetch(`http://localhost:3000/api/clientes/tipos/${cliente.id_tipo_cliente}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let tipoClienteDescripcion = 'Desconocido';

            if (tipoClienteResponse.ok) {
                const tipoCliente = await tipoClienteResponse.json();
                tipoClienteDescripcion = tipoCliente.descripcion;
            }

            // Crear una fila para el cliente
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.rut_cliente}</td>
                <td>${cliente.nom_cliente}</td>
                <td>${tipoClienteDescripcion}</td>
                <td>${cliente.email_cliente}</td>
                <td>${cliente.telefono_cliente}</td>
                <td>
                    <button class="btn btn-primary btn-sm btn-ver-cliente" data-rut="${cliente.rut_cliente}"><i class="fas fa-search"></i> Ver</button>
                    <button class="btn btn-warning btn-sm btn-editar-cliente" data-rut="${cliente.rut_cliente}"><i class="fas fa-edit"></i> Editar</button>
                </td>
            `;

            tableBody.appendChild(row);
        }

        // Agregar eventos a los botones "Ver"
        const verButtons = document.querySelectorAll('.btn-ver-cliente');
        verButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                const rutCliente = button.getAttribute('data-rut');

                try {
                    // Obtener información del cliente por su RUT
                    const clienteResponse = await fetch(`http://localhost:3000/api/clientes/${rutCliente}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!clienteResponse.ok) {
                        throw new Error('Error al obtener la información del cliente.');
                    }

                    const clienteData = await clienteResponse.json();

                    // Actualizar el contenido del modal con la información del cliente
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

                    // Mostrar el modal
                    const modal = new bootstrap.Modal(document.getElementById('modalVerCliente'));
                    modal.show();
                } catch (error) {
                    console.error('Error al obtener la información del cliente:', error);
                    alert('Error al mostrar la información del cliente. Por favor, intente nuevamente.');
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar la tabla de clientes:', error);
        alert('Error al cargar los clientes. Por favor, intente nuevamente.');
    }
});
