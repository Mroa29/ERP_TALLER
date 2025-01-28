import validarRUT from '../Funciones/ValidarRUT.js';

document.getElementById('btnagregarcliente').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = '../login/loginkronos.html';
            return;
        }

        // Decodificar el token para obtener el ID del usuario
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Obtener los datos del formulario
        const rutCliente = document.getElementById('rutCliente').value.trim();
        const nombreCliente = document.getElementById('nombreCliente').value.trim();
        const tipoClienteDesc = document.getElementById('tipoCliente').value;
        const direccion = document.getElementById('direccionCliente').value.trim();
        const comuna = document.getElementById('comunaCliente').value.trim();
        const ciudad = document.getElementById('ciudadCliente').value.trim();
        const pais = document.getElementById('paisCliente').value;
        const email = document.getElementById('emailCliente').value.trim();
        const telefono = document.getElementById('telefonoCliente').value.trim();
        const observaciones = document.getElementById('observacionesCliente').value.trim();
        const sucursalNombre = document.getElementById('sucursalCliente').value;
        const estadoDesc = document.getElementById('estadoCliente').value;

        // Validar el RUT
        if (!validarRUT(rutCliente)) {
            mostrarMensajeError('El RUT ingresado no es válido.');
            return;
        }

        // Validar campos requeridos
        if (!rutCliente || !nombreCliente || !tipoClienteDesc || !sucursalNombre || !estadoDesc) {
            mostrarMensajeError('Por favor, complete todos los campos obligatorios.');
            return;
        }

        // Validar si el cliente ya existe
        const clienteResponse = await fetch(`http://localhost:3000/api/clientes/${rutCliente}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (clienteResponse.ok) {
            mostrarMensajeError(`El cliente con RUT ${rutCliente} ya existe en la base de datos.`);
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

        // Crear el objeto cliente
        const nuevoCliente = {
            rut_cliente: rutCliente,
            nom_cliente: nombreCliente,
            direccion_cliente: direccion,
            comuna_cliente: comuna,
            ciudad_cliente: ciudad,
            pais_cliente: pais,
            email_cliente: email,
            obs_cliente: observaciones,
            telefono_cliente: telefono,
            id_sucursal: sucursalNombre,
            id_tipo_cliente: tipoClienteDesc,
            id_estado_cliente: estadoDesc,
            id_taller: idTaller,
        };

        // Enviar el cliente a la API
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

        alert('Cliente agregado exitosamente.');
        document.getElementById('idformagregarcliente').reset(); // Limpiar el formulario
        ocultarMensajeError(); // Ocultar cualquier mensaje de error previo

        // Recargar la página
        window.location.reload();
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        mostrarMensajeError(`Error al agregar cliente: ${error.message}`);
    }
});

// Función para mostrar mensajes de error en el HTML
function mostrarMensajeError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}

// Función para ocultar mensajes de error
function ocultarMensajeError() {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.style.display = 'none';
}
