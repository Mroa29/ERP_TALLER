document.addEventListener('DOMContentLoaded', async () => {
    const tablaVehiculosBody = document.querySelector('#tablalistadovehiculos tbody');
    const barraBuscarVehiculos = document.getElementById('barraBuscarVehiculos');

    try {
        // Obtener el token
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = '../login/loginkronos.html';
            return;
        }

        // Decodificar el token para obtener el userId
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Obtener información del usuario específico
        const usuarioResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
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

        // Obtener los vehículos
        const vehiculosResponse = await fetch('http://localhost:3000/api/vehiculos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!vehiculosResponse.ok) {
            throw new Error('Error al obtener los vehículos.');
        }

        const vehiculos = await vehiculosResponse.json();

        // Filtrar los vehículos por id_taller
        const vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo.id_taller === idTaller);

        // Llenar la tabla con los vehículos filtrados
        vehiculosFiltrados.forEach(vehiculo => {
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

            fila.querySelector('.btn-ver-vehiculo').addEventListener('click', () => {
                mostrarDetallesVehiculo(vehiculo);
            });

            tablaVehiculosBody.appendChild(fila);
        });

        // Evento de búsqueda en la barra de búsqueda
        barraBuscarVehiculos.addEventListener('input', () => {
            const filtro = barraBuscarVehiculos.value.toLowerCase();
            const filas = tablaVehiculosBody.querySelectorAll('tr');

            filas.forEach(fila => {
                const textoFila = fila.textContent.toLowerCase();
                if (textoFila.includes(filtro)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        });

    } catch (error) {
        console.error('Error al cargar los vehículos:', error);
        alert('Hubo un problema al cargar los vehículos. Por favor, intente nuevamente.');
    }

    // Función para mostrar los detalles del vehículo en el modal
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
