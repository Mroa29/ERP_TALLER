import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");

    // Elementos del formulario de tarifa de mano de obra
    const formAgregarTarifaManoObra = document.getElementById('formAgregarTarifaManoObra');
    const mensajeErrorTarifaManoObra = document.getElementById('mensajeErrorTarifaManoObra');

    // Verificar que los elementos existan
    if (!formAgregarTarifaManoObra || !mensajeErrorTarifaManoObra) {
        console.error("Elementos del formulario no encontrados.");
        return;
    }

    // Campos de datos
    const inputDescripcionTarifaManoObra = document.getElementById('descripcionTarifaManoObra');
    const inputPrecioPiezaManoObra = document.getElementById('precioPiezaManoObra');
    const selectSucursalTarifaManoObra = document.getElementById('sucursalSelectTarifaManoObra');

    // Evento para agregar tarifa de mano de obra
    formAgregarTarifaManoObra.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Evento submit del formulario disparado.");

        // Limpiar mensaje de error previo
        mensajeErrorTarifaManoObra.style.display = 'none';
        mensajeErrorTarifaManoObra.textContent = '';

        // Obtener valores ingresados
        const descripcionTarifa = inputDescripcionTarifaManoObra.value.trim();
        const precioPieza = parseInt(inputPrecioPiezaManoObra.value.trim(), 10);
        const idSucursal = parseInt(selectSucursalTarifaManoObra.value, 10);

        // Validar campos obligatorios
        if (!descripcionTarifa) {
            mostrarError("Debe ingresar una descripción para la tarifa.");
            return;
        }
        if (isNaN(precioPieza) || precioPieza <= 0) {
            mostrarError("Debe ingresar un precio válido.");
            return;
        }
        if (!idSucursal) {
            mostrarError("Debe seleccionar una sucursal.");
            return;
        }

        // Construir el objeto de datos a enviar
        const data = {
            descripcion_tarifa: descripcionTarifa,
            precio_por_pieza: precioPieza,
            id_sucursal: idSucursal
        };

        console.log("Datos a enviar:", data);

        try {
            // Obtener el token si se requiere autenticación
            const token = localStorage.getItem('token');
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/tarifas-mano-obra`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar la tarifa.');
            }

            const result = await response.json();
            console.log("Tarifa de mano de obra creada:", result);
            alert("Tarifa de mano de obra agregada exitosamente.");

            // Recargar la página y cerrar el modal
            window.location.reload();
            $('#agregarTarifaManoObraModal').modal('hide');
        } catch (error) {
            console.error("Error al agregar tarifa de mano de obra:", error);

            // Mostrar mensaje de error si ya existe una tarifa en esa sucursal
            let errorMsg = error.message;
            if (errorMsg.toLowerCase().includes("unique constraint")) {
                errorMsg = "Ya existe una tarifa con esta descripción en la misma sucursal.";
            }

            mostrarError(errorMsg);
        }
    });

    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        mensajeErrorTarifaManoObra.style.display = 'block';
        mensajeErrorTarifaManoObra.textContent = mensaje;
    }
});
