document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed.");

    // Elementos del formulario de tarifa
    const formAgregarTarifa = document.getElementById('formAgregarTarifa');
    const btnAgregarTarifa = document.getElementById('btnAgregarTarifa');
    const mensajeErrorTarifa = document.getElementById('mensajeErrorTarifa');

    // Verificar que los elementos existan
    if (!formAgregarTarifa) {
        console.error("No se encontró el formulario 'formAgregarTarifa'.");
        return;
    }
    if (!btnAgregarTarifa) {
        console.error("No se encontró el botón 'btnAgregarTarifa'.");
        return;
    }
    if (!mensajeErrorTarifa) {
        console.error("No se encontró el contenedor de mensaje de error 'mensajeErrorTarifa'.");
        return;
    }

    // Campos de datos
    const inputDescripcionTarifa = document.getElementById('descripcionTarifa');
    const inputPrecioPieza = document.getElementById('precioPieza');
    const selectSucursalTarifa = document.getElementById('sucursalSelectTarifa');

    // Evento para agregar tarifa
    formAgregarTarifa.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Evento submit del formulario disparado.");

        // Limpiar mensaje de error previo
        mensajeErrorTarifa.style.display = 'none';
        mensajeErrorTarifa.textContent = '';

        // Obtener valores ingresados
        const descripcionTarifa = inputDescripcionTarifa.value.trim();
        const precioPieza = inputPrecioPieza.value.trim();
        const idSucursal = selectSucursalTarifa.value;

        // Validar campos obligatorios
        if (!descripcionTarifa) {
            mensajeErrorTarifa.style.display = 'block';
            mensajeErrorTarifa.textContent = 'Debe ingresar una descripción para la tarifa.';
            return;
        }
        if (!precioPieza || isNaN(precioPieza) || parseInt(precioPieza, 10) <= 0) {
            mensajeErrorTarifa.style.display = 'block';
            mensajeErrorTarifa.textContent = 'Debe ingresar un precio válido.';
            return;
        }
        if (!idSucursal) {
            mensajeErrorTarifa.style.display = 'block';
            mensajeErrorTarifa.textContent = 'Debe seleccionar una sucursal.';
            return;
        }

        // Construir el objeto de datos a enviar
        const data = {
            descripcion_tarifa: descripcionTarifa,
            precio_por_pieza: parseInt(precioPieza, 10),
            id_sucursal: parseInt(idSucursal, 10)
        };

        console.log("Datos a enviar:", data);

        try {
            // Obtener el token si se requiere autenticación
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/tarifasPintura', {
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
            console.log("Tarifa creada:", result);
            alert("Tarifa agregada exitosamente.");

            // Recargar la página y cerrar el modal
            window.location.reload();
            $('#agregarTarifaModal').modal('hide');
        } catch (error) {
            console.error("Error al agregar tarifa:", error);

            // Mostrar mensaje de error si ya existe una tarifa en esa sucursal
            let errorMsg = error.message;
            if (errorMsg.toLowerCase().includes("unique constraint")) {
                errorMsg = "Ya existe una tarifa con esta descripción en la misma sucursal.";
            }

            mensajeErrorTarifa.style.display = 'block';
            mensajeErrorTarifa.textContent = errorMsg;
        }
    });
});
