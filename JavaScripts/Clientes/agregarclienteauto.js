import validarRUT from '../Funciones/ValidarRUT.js';
document.getElementById('btnagregarclienteauto').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            mostrarError('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = '../login/loginkronos.html';
            return;
        }

        // Decodificar el token para obtener el ID del usuario
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Obtener los datos del formulario
        const rutCliente = document.getElementById('clienteAuto_rutCliente').value.trim();
        const nombreCliente = document.getElementById('clienteAuto_nombreCliente').value.trim();
        const tipoCliente = document.getElementById('clienteAuto_tipoCliente').value;
        const telefonoCliente = document.getElementById('clienteAuto_telefonoCliente').value.trim();
        const emailCliente = document.getElementById('clienteAuto_emailCliente').value.trim();
        const direccionCliente = document.getElementById('clienteAuto_direccionCliente').value.trim();
        const comunaCliente = document.getElementById('clienteAuto_comunaCliente').value.trim();
        const ciudadCliente = document.getElementById('clienteAuto_ciudadCliente').value.trim();
        const paisCliente = document.getElementById('clienteAuto_paisCliente').value;
        const sucursalCliente = document.getElementById('clienteAuto_sucursalCliente').value;
        const estadoCliente = document.getElementById('clienteAuto_estadoCliente').value;
        const observacionesCliente = document.getElementById('clienteAuto_observacionesCliente').value.trim();

        const placaVehiculo = document.getElementById('vehiculo_placa').value.trim();
        const marcaVehiculo = document.getElementById('vehiculo_marca').value.trim();
        const modeloVehiculo = document.getElementById('vehiculo_modelo').value.trim();
        const anoVehiculo = document.getElementById('vehiculo_anio').value.trim();
        const colorVehiculo = document.getElementById('vehiculo_color').value.trim();
        const kilometrajeVehiculo = document.getElementById('vehiculo_kilometraje').value.trim();
        const motorVehiculo = document.getElementById('vehiculo_motor').value.trim();
        const tipoVehiculo = document.getElementById('vehiculo_tipo').value;

        // Validar campos obligatorios
        if (!rutCliente || !nombreCliente || !tipoCliente || !sucursalCliente || !estadoCliente || !placaVehiculo || !marcaVehiculo || !modeloVehiculo || !anoVehiculo || !tipoVehiculo) {
            mostrarError('Por favor, complete todos los campos obligatorios.');
            return;
        }

        // Validar formato del RUT
        if (!validarRUT(rutCliente)) {
            mostrarError('El RUT ingresado no es válido.');
            return;
        }

        // Obtener ID del taller asociado al usuario
        const usuarioResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!usuarioResponse.ok) {
            throw new Error('Error al obtener datos del usuario.');
        }

        const usuarioData = await usuarioResponse.json();
        const idTaller = usuarioData.user.taller;

        // Crear el cliente
        const nuevoCliente = {
            rut_cliente: rutCliente,
            nom_cliente: nombreCliente,
            direccion_cliente: direccionCliente,
            comuna_cliente: comunaCliente,
            ciudad_cliente: ciudadCliente,
            pais_cliente: paisCliente,
            email_cliente: emailCliente,
            obs_cliente: observacionesCliente,
            telefono_cliente: telefonoCliente,
            id_sucursal: sucursalCliente,
            id_tipo_cliente: tipoCliente,
            id_estado_cliente: estadoCliente,
            id_taller: idTaller,
        };

        const agregarClienteResponse = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoCliente),
        });

        if (!agregarClienteResponse.ok) {
            throw new Error('Error al agregar el cliente.');
        }

        // Crear el vehículo
        const nuevoVehiculo = {
            patente: placaVehiculo,
            marca: marcaVehiculo,
            modelo: modeloVehiculo,
            ano: anoVehiculo,
            color: colorVehiculo,
            kilometraje: kilometrajeVehiculo,
            num_motor: motorVehiculo,
            tipo: tipoVehiculo,
            rut_cliente: rutCliente, // Asocia el vehículo al cliente recién creado
            id_taller: idTaller,
        };

        const agregarVehiculoResponse = await fetch('http://localhost:3000/api/vehiculos', {
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

        mostrarExito('Cliente y vehículo agregados exitosamente.');
        document.getElementById('idformagregarclienteauto').reset(); // Limpiar el formulario
        // Recargar la página
        window.location.reload();
    } catch (error) {
        console.error('Error al agregar cliente y vehículo:', error);
        mostrarError(`Error: ${error.message}`);
    }
});

// Función para mostrar errores en el formulario
function mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensajeErrorclienteauto');
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}

// Función para mostrar mensaje de éxito
function mostrarExito(mensaje) {
    alert(mensaje);
    const mensajeError = document.getElementById('mensajeErrorclienteauto');
    mensajeError.style.display = 'none';
}
