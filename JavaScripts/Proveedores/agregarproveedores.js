import CONFIG from "../configURL.js";

document.getElementById('btnagregarproveedor').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const mensajeErrorProveedor = document.getElementById('mensajeErrorproveedor');

    try {
        // 📌 Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = '../login/loginkronos.html';
            return;
        }

        // 📌 Decodificar el token para obtener el ID del usuario
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // 📌 Obtener el id_taller del usuario
        const usuarioResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!usuarioResponse.ok) {
            throw new Error('Error al obtener los datos del usuario.');
        }

        const usuarioData = await usuarioResponse.json();
        const idTaller = usuarioData.user.taller; // Capturar id_taller del usuario

        // 📌 Obtener los datos del formulario
        const rutProveedor = document.getElementById('rutproveedor').value.trim();
        const razonSocial = document.getElementById('razonsocial').value.trim();
        const giro = document.getElementById('giro').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const personaContacto = document.getElementById('personacontacto').value.trim();
        const paginaWeb = document.getElementById('paginaweb').value.trim();
        const tipoProveedor = document.getElementById('tipoproveedor').value;

        // 📌 Validar campos obligatorios
        if (!rutProveedor || !razonSocial || !tipoProveedor) {
            mensajeErrorProveedor.textContent = 'Por favor, complete todos los campos obligatorios.';
            mensajeErrorProveedor.style.display = 'block';
            return;
        }

        // 📌 Verificar si el proveedor ya existe
        const proveedorExisteResponse = await fetch(`${CONFIG.API_BASE_URL}/api/proveedores/${rutProveedor}/${idTaller}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (proveedorExisteResponse.ok) {
            mensajeErrorProveedor.textContent = `El proveedor con RUT ${rutProveedor} ya está registrado en el sistema.`;
            mensajeErrorProveedor.style.display = 'block';
            return;
        }

        // 📌 Crear el objeto proveedor
        const nuevoProveedor = {
            rut: rutProveedor,
            id_taller: idTaller,
            razon_social: razonSocial,
            giro: giro,
            direccion: direccion,
            telefono: telefono,
            email: correo,
            persona_contacto: personaContacto,
            pagina_web: paginaWeb,
            id_tipo_proveedor: tipoProveedor,
        };

        // 📌 Enviar la solicitud para agregar el proveedor
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/proveedores`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProveedor),
        });

        if (!response.ok) {
            throw new Error('Error al agregar el proveedor.');
        }

        alert('Proveedor agregado exitosamente.');
        document.getElementById('idformagregarproveedor').reset(); // Limpiar el formulario
        mensajeErrorProveedor.style.display = 'none'; // Ocultar mensaje de error

        // 📌 Opcional: Recargar la página o actualizar la tabla
        location.reload();
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        mensajeErrorProveedor.textContent = `Error al agregar proveedor: ${error.message}`;
        mensajeErrorProveedor.style.display = 'block';
    }
});
