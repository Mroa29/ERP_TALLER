import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', () => {
    const btnAgregarVehiculo = document.getElementById('btnagregarvehiculo');
    const mensajeError = document.getElementById('mensajeErrorVehiculo');
    const buscarClienteInput = document.getElementById('buscarCliente');
    const clienteSeleccionadoInput = document.getElementById('clienteSeleccionado');

    // 📌 Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }

    // 📌 Función para ocultar mensajes de error
    function ocultarError() {
        mensajeError.style.display = 'none';
    }

    // 📌 Habilitar o deshabilitar el botón según el cliente seleccionado
    buscarClienteInput.addEventListener('input', () => {
        btnAgregarVehiculo.disabled = clienteSeleccionadoInput.value.trim() === '';
    });

    btnAgregarVehiculo.addEventListener('click', async (event) => {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        try {
            // 📌 Obtener el token del usuario
            const token = localStorage.getItem('token');
            if (!token) {
                mostrarError('No hay sesión activa. Por favor, inicie sesión.');
                window.location.href = '../login/loginkronos.html';
                return;
            }

            // 📌 Decodificar el token para obtener el userId
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;

            // 📌 Obtener información del usuario
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

            // 📌 Obtener datos del formulario
            const rutCliente = clienteSeleccionadoInput.value.trim();
            const patente = document.getElementById('patenteVehiculo').value.trim().toUpperCase();
            const marca = document.getElementById('marcaVehiculo').value.trim();
            const modelo = document.getElementById('modeloVehiculo').value.trim();
            const ano = document.getElementById('anioVehiculo').value.trim();
            const color = document.getElementById('colorVehiculo').value.trim();
            const kilometraje = document.getElementById('kilometrajeVehiculo').value.trim();
            const numMotor = document.getElementById('numMotorVehiculo').value.trim();
            const tipo = document.getElementById('tipoVehiculoSelect').value;
            const observaciones = document.getElementById('obsVehiculo').value.trim();

            // 📌 Validación de campos obligatorios
            if (!rutCliente || !patente || !marca || !modelo || !ano || !kilometraje || !tipo) {
                mostrarError('Por favor, complete todos los campos obligatorios.');
                return;
            }

            // 📌 Verificar si la patente ya está registrada en la base de datos
            const existePatenteResponse = await fetch(`${CONFIG.API_BASE_URL}/api/vehiculos/${patente}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (existePatenteResponse.ok) {
                mostrarError('La patente ingresada ya está registrada en el sistema.');
                return;
            }

            // 📌 Crear objeto del vehículo
            const nuevoVehiculo = {
                patente,
                marca,
                modelo,
                ano,
                color,
                kilometraje,
                num_motor: numMotor,
                tipo,
                obs_vehiculo: observaciones,
                rut_cliente: rutCliente,
                id_taller: idTaller,
            };

            // 📌 Enviar el vehículo a la API
            const agregarVehiculoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/vehiculos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoVehiculo),
            });

            if (!agregarVehiculoResponse.ok) {
                throw new Error('Error al agregar el vehículo.');
            }

            // 📌 Mostrar mensaje de éxito y limpiar el formulario
            alert('Vehículo agregado exitosamente.');
            document.getElementById('idformagregarvehiculo').reset();
            clienteSeleccionadoInput.value = ''; // Limpiar cliente seleccionado
            btnAgregarVehiculo.disabled = true; // Deshabilitar el botón
            ocultarError(); // Ocultar mensaje de error

            // 📌 Recargar la página para reflejar los cambios
            window.location.reload();
        } catch (error) {
            console.error('❌ Error al agregar el vehículo:', error);
            mostrarError(`Error: ${error.message}`);
        }
    });

    // 📌 Limpiar mensaje de error al cerrar el modal
    $('#agregarvehiculomodal').on('hidden.bs.modal', () => {
        ocultarError();
        document.getElementById('idformagregarvehiculo').reset();
        clienteSeleccionadoInput.value = '';
        btnAgregarVehiculo.disabled = true;
    });
});
