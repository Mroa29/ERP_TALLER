import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tablaVehiculosBody = document.querySelector('#tablalistadovehiculos tbody');
    const barraBuscarVehiculos = document.getElementById('barraBuscarVehiculos');

    try {
        // 📌 Obtener el token
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = '../login/loginkronos.html';
            return;
        }

        // 📌 Decodificar el token para obtener el `userId`
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // 📌 Obtener información del usuario específico
        const usuarioResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!usuarioResponse.ok) {
            throw new Error('Error al obtener información del usuario.');
        }

        const usuarioData = await usuarioResponse.json();
        const idTaller = usuarioData.user.taller;

        // 📌 Obtener los vehículos
        const vehiculosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/vehiculos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!vehiculosResponse.ok) {
            throw new Error('Error al obtener los vehículos.');
        }

        let vehiculos = await vehiculosResponse.json();

        // 📌 Filtrar los vehículos por `id_taller` y ordenar en orden inverso
        const vehiculosFiltrados = vehiculos
            .filter(vehiculo => vehiculo.id_taller === idTaller)
            .reverse(); // 🔹 Ordena los más recientes primero

        // 📌 Llenar la tabla con los vehículos filtrados
        llenarTablaVehiculos(vehiculosFiltrados);

        // 📌 Evento de búsqueda en la barra de búsqueda
        barraBuscarVehiculos.addEventListener('input', () => {
            const filtro = barraBuscarVehiculos.value.toLowerCase().trim();
            const vehiculosFiltradosBusqueda = vehiculosFiltrados.filter(vehiculo =>
                vehiculo.patente_vehiculo.toLowerCase().includes(filtro) ||
                vehiculo.marca_vehiculo.toLowerCase().includes(filtro) ||
                vehiculo.modelo_vehiculo.toLowerCase().includes(filtro) ||
                vehiculo.ano_vehiculo.toString().includes(filtro) ||
                vehiculo.rut_cliente.toLowerCase().includes(filtro)
            );

            llenarTablaVehiculos(vehiculosFiltradosBusqueda);
        });

    } catch (error) {
        console.error('❌ Error al cargar los vehículos:', error);
        alert('Hubo un problema al cargar los vehículos. Por favor, intente nuevamente.');
    }

    // 📌 Función para llenar la tabla de vehículos
    function llenarTablaVehiculos(vehiculos) {
        tablaVehiculosBody.innerHTML = ''; // 🔹 Limpia la tabla antes de llenarla

        vehiculos.forEach(vehiculo => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${vehiculo.patente_vehiculo}</td>
                <td>${vehiculo.marca_vehiculo}</td>
                <td>${vehiculo.modelo_vehiculo}</td>
                <td>${vehiculo.ano_vehiculo}</td>
                <td>${vehiculo.rut_cliente}</td>
                <td>
                    <button class="btn btn-info btn-sm btn-ver-vehiculo" data-patente="${vehiculo.patente_vehiculo}">
                        <i class="fas fa-search"></i> Ver
                    </button>
                    <button class="btn btn-warning btn-sm btn-editar-vehiculo" data-patente="${vehiculo.patente_vehiculo}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;

            // 📌 Asignar eventos a los botones "Ver" y "Editar"
            fila.querySelector('.btn-ver-vehiculo').addEventListener('click', () => {
                mostrarDetallesVehiculo(vehiculo);
            });

            tablaVehiculosBody.appendChild(fila);
        });
    }

    // 📌 Función para mostrar los detalles del vehículo en el modal
    function mostrarDetallesVehiculo(vehiculo) {
        document.getElementById('detallePatente').textContent = vehiculo.patente_vehiculo;
        document.getElementById('detalleMarca').textContent = vehiculo.marca_vehiculo;
        document.getElementById('detalleModelo').textContent = vehiculo.modelo_vehiculo;
        document.getElementById('detalleAnio').textContent = vehiculo.ano_vehiculo;
        document.getElementById('detalleColor').textContent = vehiculo.color_vehiculo || 'No especificado';
        document.getElementById('detalleKilometraje').textContent = vehiculo.kilometraje_vehiculo || 'No especificado';
        document.getElementById('detalleMotor').textContent = vehiculo.num_motor_vehiculo || 'No especificado';
        document.getElementById('detalleTipo').textContent = vehiculo.tipo_vehiculo || 'No especificado';
        document.getElementById('detalleRutCliente').textContent = vehiculo.rut_cliente;
        document.getElementById('detalleObservaciones').textContent = vehiculo.obs_vehiculo || 'No especificado';

        const modal = new bootstrap.Modal(document.getElementById('verVehiculoModal'));
        modal.show();
    }
});
