import CONFIG from "../configURL.js"; // 📌 Archivo de configuración con la URL base de la API

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed.");

  // Elementos del formulario de presupuesto
  const formPresupuesto = document.getElementById('formAgregarPresupuesto');
  const btnAgregarPresupuesto = document.getElementById('btnAgregarPresupuesto');
  const mensajeError = document.getElementById('mensajeErrorPresupuesto');

  // Verificar que los elementos existan
  if (!formPresupuesto) {
    console.error("No se encontró el formulario 'formAgregarPresupuesto'.");
    return;
  }
  if (!btnAgregarPresupuesto) {
    console.error("No se encontró el botón 'btnAgregarPresupuesto'.");
    return;
  }
  if (!mensajeError) {
    console.error("No se encontró el contenedor de mensaje de error 'mensajeErrorPresupuesto'.");
    return;
  }

  // Campos de datos
  const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');
  const inputVehiculoSeleccionado = document.getElementById('vehiculoSeleccionado');
  const inputDiasValidez = document.getElementById('diasValidezPresupuesto');
  const selectSucursal = document.getElementById('sucursalSelect');
  const textareaObs = document.getElementById('obsPresupuesto');

  // Agregar el evento 'submit' al formulario
  formPresupuesto.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("Evento submit del formulario disparado.");

    // Limpiar mensaje de error previo
    mensajeError.style.display = 'none';
    mensajeError.textContent = '';

    // Obtener valores ingresados
    const rutCliente = inputClienteSeleccionado.value.trim();
    const placaVehiculo = inputVehiculoSeleccionado.value.trim();
    const diasValidez = inputDiasValidez.value.trim();
    const idSucursal = selectSucursal.value;
    const observaciones = textareaObs.value.trim();

    // Validar campos obligatorios
    if (!rutCliente) {
      mensajeError.style.display = 'block';
      mensajeError.textContent = 'Debe seleccionar un cliente.';
      return;
    }
    if (!placaVehiculo) {
      mensajeError.style.display = 'block';
      mensajeError.textContent = 'Debe seleccionar un vehículo.';
      return;
    }
    if (!diasValidez) {
      mensajeError.style.display = 'block';
      mensajeError.textContent = 'El campo "Días de Validez" es obligatorio.';
      return;
    }
    if (!idSucursal) {
      mensajeError.style.display = 'block';
      mensajeError.textContent = 'Debe seleccionar una sucursal.';
      return;
    }

    // Construir el objeto de datos a enviar
    const data = {
      rut_cliente: rutCliente,
      placa_vehiculo: placaVehiculo,
      dias_validez_presupuesto_general: parseInt(diasValidez, 10),
      obs_presupuesto_general: observaciones,
      id_sucursal: parseInt(idSucursal, 10)
    };

    console.log("Datos a enviar:", data);

    try {
      // Obtener el token si se requiere autenticación
      const token = localStorage.getItem('token');
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/presupuestos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar el presupuesto.');
      }

      const result = await response.json();
      console.log("Presupuesto creado:", result);
      alert("Presupuesto agregado exitosamente.");

      // Recargar la página y cerrar el modal
      window.location.reload();
      $('#agregarPresupuestomodal').modal('hide');
    } catch (error) {
      console.error("Error al agregar presupuesto:", error);
      // Si el error indica que la combinación de placa e id_sucursal ya existe, mostrar mensaje personalizado
      let errorMsg = error.message;
      if (errorMsg.toLowerCase().includes("unique_placa_idsucursal")) {
        errorMsg = "Este presupuesto ya existe para esta sucursal";
      }
      mensajeError.style.display = 'block';
      mensajeError.textContent = errorMsg;
    }
  });
});
