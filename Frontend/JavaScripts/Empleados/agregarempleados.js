import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnAgregarEmpleado = document.getElementById('btnAgregarEmpleado');

    btnAgregarEmpleado.addEventListener('click', async (event) => {
        event.preventDefault();

        try {
            // Obtener el token del usuario
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No hay sesión activa. Por favor, inicie sesión.');
                window.location.href = '../login/loginkronos.html';
                return;
            }

            // Decodificar el token para obtener el ID del usuario
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;

            // Obtener ID del taller del usuario
            const usuarioResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}`, {
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

            // Obtener datos del formulario
            const empleado = {
                rut: document.getElementById('rutEmpleado').value.trim(),
                id_taller: idTaller,
                nombre: document.getElementById('nombreEmpleado').value.trim(),
                direccion: document.getElementById('direccionEmpleado').value.trim(),
                comuna: document.getElementById('comunaEmpleado').value.trim(),
                ciudad: document.getElementById('ciudadEmpleado').value.trim(),
                nacionalidad: document.getElementById('nacionalidadEmpleado').value.trim(),
                fecha_nacimiento: document.getElementById('fechaNacimientoEmpleado').value,
                estado_civil: document.getElementById('estadoCivilEmpleado').value,
                grupo_sanguineo: document.getElementById('grupoSanguineoEmpleado').value.trim(),
                telefono: document.getElementById('telefonoEmpleado').value.trim(),
                telefono_emergencia: document.getElementById('emergenciaEmpleado').value.trim(),
                prevision_salud: document.getElementById('previsionSaludEmpleado').value.trim(),
                afp: document.getElementById('afpEmpleado').value.trim(),
                email: document.getElementById('correoEmpleado').value.trim(),
                observaciones: document.getElementById('observacionesEmpleado').value.trim(),
                id_cargo: document.getElementById('idCargoEmpleado').value,
            };

            // Validación de campos requeridos
            if (!empleado.rut || !empleado.nombre || !empleado.id_cargo || !empleado.fecha_nacimiento || !empleado.nacionalidad) {
                mostrarError('Por favor, complete todos los campos obligatorios.');
                return;
            }

            // Enviar la solicitud POST a la API
            const agregarEmpleadoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/empleados`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empleado),
            });

            if (!agregarEmpleadoResponse.ok) {
                throw new Error('Error al agregar el empleado.');
            }

            alert('Empleado agregado exitosamente.');
            document.getElementById('idformagregarempleado').reset(); // Limpiar el formulario
            $('#agregarEmpleadoModal').modal('hide'); // Cerrar el modal
            
            window.location.reload(); // Recargar la página para actualizar la lista
        } catch (error) {
            console.error('Error al agregar el empleado:', error);
            mostrarError(`Error: ${error.message}`);
        }
    });

    // Función para mostrar mensajes de error en el HTML
    function mostrarError(mensaje) {
        const mensajeError = document.getElementById('mensajeErrorempleado');
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }
});
