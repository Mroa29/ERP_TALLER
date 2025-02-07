import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', function () {
    // ELEMENTOS PARA VEHÍCULO
    const inputBuscarVehiculo = document.getElementById('buscarVehiculo');
    const listaCoincidenciasVehiculos = document.getElementById('listaCoincidenciasVehiculos');
    const inputVehiculoSeleccionado = document.getElementById('vehiculoSeleccionado');
    const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');

    let vehiclesForClient = []; // Almacena los vehículos del cliente seleccionado

    // 📌 Obtener vehículos de un cliente por su RUT
    async function fetchVehiclesForClient(rut_cliente) {
        try {
            console.log(`🔄 Cargando vehículos para el cliente ${rut_cliente}...`);

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/vehiculos/rut-cliente/${rut_cliente}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Error al obtener los vehículos del cliente.');

            vehiclesForClient = await response.json();
            console.log('✅ Vehículos cargados:', vehiclesForClient);
        } catch (error) {
            console.error('❌ Error al cargar los vehículos:', error);
            vehiclesForClient = [];
            alert('Error al cargar los vehículos del cliente seleccionado.');
        }
    }

    // 📌 Manejo de la búsqueda de vehículos
    inputBuscarVehiculo.addEventListener('input', async function () {
        const filtro = this.value.toLowerCase().trim();
        listaCoincidenciasVehiculos.innerHTML = ''; // Limpiar coincidencias previas

        if (!inputClienteSeleccionado.value) {
            alert('Debe seleccionar un cliente primero.');
            inputBuscarVehiculo.value = '';
            return;
        }

        // Si no se han cargado aún los vehículos, hacer la consulta
        if (vehiclesForClient.length === 0) {
            await fetchVehiclesForClient(inputClienteSeleccionado.value);
        }

        if (filtro.length === 0) return;

        // Filtrar vehículos por patente o modelo
        const coincidencias = vehiclesForClient.filter(vehicle =>
            vehicle.patente_vehiculo.toLowerCase().includes(filtro) ||
            (vehicle.modelo_vehiculo && vehicle.modelo_vehiculo.toLowerCase().includes(filtro))
        );

        // Mostrar coincidencias en la lista
        coincidencias.forEach(vehicle => {
            const item = document.createElement('a');
            item.href = '#';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.textContent = `${vehicle.patente_vehiculo} - ${vehicle.modelo_vehiculo || ''}`;
            item.addEventListener('click', function (e) {
                e.preventDefault();
                seleccionarVehiculo(vehicle);
            });
            listaCoincidenciasVehiculos.appendChild(item);
        });
    });

    // 📌 Función para seleccionar un vehículo
    function seleccionarVehiculo(vehicle) {
        inputVehiculoSeleccionado.value = vehicle.patente_vehiculo; // Mostrar la patente
        listaCoincidenciasVehiculos.innerHTML = ''; // Limpiar lista
        inputBuscarVehiculo.value = ''; // Limpiar búsqueda
    }

    // 📌 Refrescar la barra del vehículo al cambiar de cliente
    inputClienteSeleccionado.addEventListener('change', async function () {
        console.log("🔄 Cliente cambiado, limpiando búsqueda de vehículos...");

        inputVehiculoSeleccionado.value = ''; // Limpiar vehículo seleccionado
        inputBuscarVehiculo.value = ''; // Limpiar búsqueda de vehículo
        listaCoincidenciasVehiculos.innerHTML = ''; // Limpiar coincidencias
        vehiclesForClient = []; // Resetear lista de vehículos

        // Cargar los vehículos del nuevo cliente seleccionado
        if (inputClienteSeleccionado.value) {
            await fetchVehiclesForClient(inputClienteSeleccionado.value);
        }
    });

    // 📌 Limpiar la selección de vehículo al cerrar el modal
    $('#agregarPresupuestomodal').on('hidden.bs.modal', function () {
        console.log("🔄 Modal cerrado, limpiando selecciones...");
        inputVehiculoSeleccionado.value = '';
        inputBuscarVehiculo.value = '';
        listaCoincidenciasVehiculos.innerHTML = '';
        vehiclesForClient = [];
    });
});
