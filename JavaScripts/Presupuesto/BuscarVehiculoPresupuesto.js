document.addEventListener('DOMContentLoaded', function () {
    // ELEMENTOS PARA VEHÍCULO
    const inputBuscarVehiculo = document.getElementById('buscarVehiculo');
    const listaCoincidenciasVehiculos = document.getElementById('listaCoincidenciasVehiculos');
    const inputVehiculoSeleccionado = document.getElementById('vehiculoSeleccionado');
    // Utilizamos este elemento para verificar si hay un cliente seleccionado
    const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');
  
    let vehiclesForClient = []; // Array para almacenar los vehículos del cliente seleccionado
  
    // Función para obtener vehículos asociados a un cliente (según su RUT)
    async function fetchVehiclesForClient(rut_cliente) {
      try {
        const response = await fetch(`http://localhost:3000/api/vehiculos/rut-cliente/${rut_cliente}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al obtener los vehículos del cliente.');
        vehiclesForClient = await response.json();
        console.log('Vehículos para el cliente:', vehiclesForClient);
      } catch (error) {
        console.error('Error al cargar los vehículos:', error);
        vehiclesForClient = [];
        alert('Error al cargar los vehículos para el cliente seleccionado.');
      }
    }
  
    // Manejo de la búsqueda de vehículos
    inputBuscarVehiculo.addEventListener('input', async function () {
      const filtro = this.value.toLowerCase().trim();
      listaCoincidenciasVehiculos.innerHTML = ''; // Limpiar coincidencias previas
  
      // Verificar que se haya seleccionado un cliente
      if (!inputClienteSeleccionado.value) {
        alert('Debe seleccionar un cliente primero.');
        inputBuscarVehiculo.value = '';
        return;
      }
  
      // Si no se han obtenido aún los vehículos, realizamos la consulta
      if (vehiclesForClient.length === 0) {
        await fetchVehiclesForClient(inputClienteSeleccionado.value);
      }
  
      if (filtro.length === 0) return;
  
      // Filtrar vehículos por patente o modelo
      const coincidencias = vehiclesForClient.filter(vehicle =>
        vehicle.patente_vehiculo.toLowerCase().includes(filtro) ||
        (vehicle.modelo_vehiculo && vehicle.modelo_vehiculo.toLowerCase().includes(filtro))
      );
  
      // Mostrar cada coincidencia en la lista
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
  
    // Función para seleccionar un vehículo
    function seleccionarVehiculo(vehicle) {
      inputVehiculoSeleccionado.value = vehicle.patente_vehiculo; // Muestra la patente (o cualquier identificador deseado)
      listaCoincidenciasVehiculos.innerHTML = '';
      inputBuscarVehiculo.value = '';
    }
  
    // Limpiar la selección de vehículo cuando se cierre el modal
    $('#agregarPresupuestomodal').on('hidden.bs.modal', function () {
      inputVehiculoSeleccionado.value = '';
      inputBuscarVehiculo.value = '';
      listaCoincidenciasVehiculos.innerHTML = '';
      vehiclesForClient = [];
    });
  });
  