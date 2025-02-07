import CONFIG from "../configURL.js"; // 📌 Importamos la URL base desde un archivo de configuración

document.addEventListener('DOMContentLoaded', async () => {
  const tipoVehiculoSelect = document.getElementById('tipoVehiculoSelect');

  if (!tipoVehiculoSelect) {
    console.error('No se encontró el elemento select para el tipo de vehículo');
    return;
  }

  try {
    // 📌 Limpiar el select antes de rellenarlo
    tipoVehiculoSelect.innerHTML = '<option value="">Seleccione un tipo de vehículo</option>';

    // 📌 Realizar la solicitud para obtener los tipos de vehículos
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/vehiculos/tipos`, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Error al obtener los tipos de vehículo');
    }

    const tiposVehiculos = await response.json();

    // 📌 Rellenar el select con los tipos de vehículo
    tiposVehiculos.forEach((tipoVehiculo) => {
      const option = document.createElement('option');
      option.value = tipoVehiculo.id_tipo_vehiculo; // Guardar el ID del tipo de vehículo
      option.textContent = tipoVehiculo.descripcion;
      tipoVehiculoSelect.appendChild(option);
    });

    console.log('Tipos de vehículo cargados correctamente');
  } catch (error) {
    console.error('Error al cargar los tipos de vehículo:', error.message);
    alert('Hubo un problema al cargar los tipos de vehículo. Intente nuevamente.');
  }

  // 📌 Evento para manejar el cambio de selección del tipo de vehículo
  tipoVehiculoSelect.addEventListener('change', () => {
    const selectedValue = tipoVehiculoSelect.value; // ID del tipo de vehículo seleccionado
    console.log('ID del tipo de vehículo seleccionado:', selectedValue);
  });
});
