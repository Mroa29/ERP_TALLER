document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed.");

    // Elementos del formulario de tarifa de mano de obra
    const formAgregarTarifaManoObra = document.getElementById('formAgregarTarifaManoObra');
    const btnAgregarTarifaManoObra = document.getElementById('btnAgregarTarifaManoObra');
    const mensajeErrorTarifaManoObra = document.getElementById('mensajeErrorTarifaManoObra');

    // Verificar que los elementos existan
    if (!formAgregarTarifaManoObra) {
        console.error("No se encontró el formulario 'formAgregarTarifaManoObra'.");
        return;
    }
    if (!btnAgregarTarifaManoObra) {
        console.error("No se encontró el botón 'btnAgregarTarifaManoObra'.");
        return;
    }
    if (!mensajeErrorTarifaManoObra) {
        console.error("No se encontró el contenedor de mensaje de error 'mensajeErrorTarifaManoObra'.");
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
        const precioPieza = inputPrecioPiezaManoObra.value.trim();
        const idSucursal = selectSucursalTarifaManoObra.value;

        // Validar campos obligatorios
        if (!descripcionTarifa) {
            mensajeErrorTarifaManoObra.style.display = 'block';
            mensajeErrorTarifaManoObra.textContent = 'Debe ingresar una descripción para la tarifa.';
            return;
        }
        if (!precioPieza || isNaN(precioPieza) || parseInt(precioPieza, 10) <= 0) {
            mensajeErrorTarifaManoObra.style.display = 'block';
            mensajeErrorTarifaManoObra.textContent = 'Debe ingresar un precio válido.';
            return;
        }
        if (!idSucursal) {
            mensajeErrorTarifaManoObra.style.display = 'block';
            mensajeErrorTarifaManoObra.textContent = 'Debe seleccionar una sucursal.';
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
            const response = await fetch('http://localhost:3000/api/tarifas-mano-obra', {
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

            mensajeErrorTarifaManoObra.style.display = 'block';
            mensajeErrorTarifaManoObra.textContent = errorMsg;
        }
    });
});
