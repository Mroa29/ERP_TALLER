document.addEventListener('DOMContentLoaded', () => {
    const tablaVehiculosBody = document.querySelector('#tablalistadovehiculos tbody');

    // Manejar el clic en el botón "Editar"
    tablaVehiculosBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-editar-vehiculo') || event.target.closest('.btn-editar-vehiculo')) {
            const patente = event.target.closest('.btn-editar-vehiculo').getAttribute('data-patente');

            try {
                // Obtener datos del vehículo específico
                const token = localStorage.getItem('token');
                const vehiculoResponse = await fetch(`http://localhost:3000/api/vehiculos/${patente}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!vehiculoResponse.ok) {
                    throw new Error('Error al obtener información del vehículo.');
                }

                const vehiculo = await vehiculoResponse.json();

                // Llenar el modal con los datos del vehículo
                document.getElementById('editarMarcaVehiculo').value = vehiculo.marca_vehiculo || '';
                document.getElementById('editarModeloVehiculo').value = vehiculo.modelo_vehiculo || '';
                document.getElementById('editarAnioVehiculo').value = vehiculo.ano_vehiculo || '';
                document.getElementById('editarColorVehiculo').value = vehiculo.color_vehiculo || '';
                document.getElementById('editarKilometrajeVehiculo').value = vehiculo.kilometraje_vehiculo || '';
                document.getElementById('editarMotorVehiculo').value = vehiculo.num_motor_vehiculo || '';

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('editarVehiculoModal'));
                modal.show();

                // Guardar los cambios al presionar "Guardar Cambios"
                document.getElementById('btnGuardarCambiosVehiculo').onclick = async () => {
                    // Crear objeto con datos actualizados
                    const vehiculoActualizado = {
                        marca: document.getElementById('editarMarcaVehiculo').value.trim() || vehiculo.marca_vehiculo,
                        modelo: document.getElementById('editarModeloVehiculo').value.trim() || vehiculo.modelo_vehiculo,
                        ano: document.getElementById('editarAnioVehiculo').value.trim() || vehiculo.ano_vehiculo,
                        color: document.getElementById('editarColorVehiculo').value.trim() || vehiculo.color_vehiculo,
                        kilometraje: document.getElementById('editarKilometrajeVehiculo').value.trim() || vehiculo.kilometraje_vehiculo,
                        tipo: vehiculo.tipo_vehiculo, // No editable, conservar el original
                        num_motor: document.getElementById('editarMotorVehiculo').value.trim() || vehiculo.num_motor_vehiculo,
                        observaciones: vehiculo.obs_vehiculo, // No editable, conservar el original
                        rut_cliente: vehiculo.rut_cliente, // No editable, conservar el original
                        id_taller: vehiculo.id_taller, // No editable, conservar el original
                    };

                    try {
                        const actualizarResponse = await fetch(`http://localhost:3000/api/vehiculos/${patente}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(vehiculoActualizado),
                        });

                        if (!actualizarResponse.ok) {
                            throw new Error('Error al actualizar el vehículo.');
                        }

                        alert('Vehículo actualizado exitosamente.');
                        modal.hide();
                        window.location.reload(); // Recargar la página para reflejar los cambios
                    } catch (error) {
                        console.error('Error al actualizar el vehículo:', error);
                        alert('Hubo un problema al guardar los cambios. Por favor, intente nuevamente.');
                    }
                };
            } catch (error) {
                console.error('Error al cargar datos del vehículo:', error);
                alert('Hubo un problema al cargar los datos del vehículo.');
            }
        }
    });
});
