import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            // Si no hay token, redirigir al login
            window.location.href = '../Login/loginkronos.html';
            return;
        }

        // Decodificar el token para obtener el ID del usuario
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Realizar la consulta a la API para contar las notificaciones visibles
        const countResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/notificaciones/count`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!countResponse.ok) {
            throw new Error('Error al obtener la cantidad de notificaciones');
        }

        const { count } = await countResponse.json();

        // Actualizar el contador de notificaciones
        const notificacionesCountElement = document.getElementById('cant_notificaciones');
        if (notificacionesCountElement) {
            notificacionesCountElement.textContent = count;
        }

        // Realizar la consulta a la API para obtener las notificaciones
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/notificaciones`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener las notificaciones');
        }

        const data = await response.json();
        const notificaciones = data.filter(notificacion => notificacion.visibilidad_notificacion);

        // Obtener el contenedor de notificaciones en el HTML
        const notificacionesContainer = document.getElementById('notificaciones_usuario');

        // Limpiar las notificaciones previas (si existen)
        notificacionesContainer.innerHTML = '';

        // Iterar sobre las notificaciones y construir los elementos HTML
        notificaciones.forEach(notificacion => {
            const notificacionElement = document.createElement('a');
            notificacionElement.href = '#';
            notificacionElement.className = 'dropdown-item';

            notificacionElement.innerHTML = `
                <div class="media">
                    <img src="../dist/img/logo.png" alt="User Avatar" class="img-size-50 mr-3 img-circle">
                    <div class="media-body">
                        <h3 class="dropdown-item-title">
                            ${notificacion.titulo_notificacion}
                            <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                        </h3>
                        <p class="text-sm">${notificacion.asunto_notificacion}</p>
                        <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> ${new Date(notificacion.fecha_creacion_notificacion).toLocaleString()}</p>
                    </div>
                </div>
            `;

            // Añadir evento para abrir el modal con detalles de la notificación
            notificacionElement.addEventListener('click', () => {
                const modal = document.getElementById('notificacionModal');
                const modalTitle = modal.querySelector('#notificacionModalLabel');
                const modalBody = modal.querySelector('.modal-body');

                // Insertar los detalles de la notificación
                modalTitle.textContent = notificacion.titulo_notificacion;
                modalBody.textContent = notificacion.descripcion_notificacion;

                // Mostrar el modal
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();

                // Asignar evento al botón "Ok" para cerrar el modal
                const okButton = modal.querySelector('#OK_NOTI');
                okButton.onclick = () => {
                    bootstrapModal.hide(); // Solo cierra el modal
                };
            });

            notificacionesContainer.appendChild(notificacionElement);

            // Añadir un divisor después de cada notificación (excepto la última)
            if (notificaciones.indexOf(notificacion) < notificaciones.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'dropdown-divider';
                notificacionesContainer.appendChild(divider);
            }
        });

        // Agregar el botón de "Cerrar Notificaciones"
        const footer = document.createElement('a');
        footer.href = '#';
        footer.className = 'dropdown-item dropdown-footer';
        footer.textContent = 'Cerrar Notificaciones';
        notificacionesContainer.appendChild(footer);

    } catch (error) {
        console.error('Error al procesar las notificaciones:', error);
        alert('Error al cargar las notificaciones.');
    }
});
