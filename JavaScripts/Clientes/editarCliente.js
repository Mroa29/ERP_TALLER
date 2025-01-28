document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('btn-editar-cliente')) {
      const rutCliente = event.target.getAttribute('data-rut');

      try {
          // Obtener datos del cliente
          const clienteResponse = await fetch(`http://localhost:3000/api/clientes/${rutCliente}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (!clienteResponse.ok) {
              throw new Error('Error al obtener la información del cliente.');
          }

          const clienteData = await clienteResponse.json();

          // Llenar los campos del modal con los datos del cliente
          document.getElementById('editarNombreCliente').value = clienteData.nom_cliente || '';
          document.getElementById('editarTelefonoCliente').value = clienteData.telefono_cliente || '';
          document.getElementById('editarEmailCliente').value = clienteData.email_cliente || '';
          document.getElementById('editarDireccionCliente').value = clienteData.direccion_cliente || '';
          document.getElementById('editarComunaCliente').value = clienteData.comuna_cliente || '';
          document.getElementById('editarCiudadCliente').value = clienteData.ciudad_cliente || '';
          document.getElementById('editarPaisCliente').value = clienteData.pais_cliente || '';

          // Mostrar el modal
          const modalEditarCliente = new bootstrap.Modal(document.getElementById('modalEditarCliente'));
          modalEditarCliente.show();

          // Manejar el guardado de cambios
          document.getElementById('btnGuardarCambiosCliente').onclick = async () => {
              // Crear un objeto con los datos actualizados, manteniendo los campos existentes si no se modifican
              const clienteActualizado = {
                  nom_cliente: document.getElementById('editarNombreCliente').value.trim() || clienteData.nom_cliente,
                  telefono_cliente: document.getElementById('editarTelefonoCliente').value.trim() || clienteData.telefono_cliente,
                  email_cliente: document.getElementById('editarEmailCliente').value.trim() || clienteData.email_cliente,
                  direccion_cliente: document.getElementById('editarDireccionCliente').value.trim() || clienteData.direccion_cliente,
                  comuna_cliente: document.getElementById('editarComunaCliente').value.trim() || clienteData.comuna_cliente,
                  ciudad_cliente: document.getElementById('editarCiudadCliente').value.trim() || clienteData.ciudad_cliente,
                  pais_cliente: document.getElementById('editarPaisCliente').value.trim() || clienteData.pais_cliente,
                  id_sucursal: clienteData.id_sucursal, // Mantener el valor original
                  id_tipo_cliente: clienteData.id_tipo_cliente, // Mantener el valor original
                  id_estado_cliente: clienteData.id_estado_cliente, // Mantener el valor original
                  id_taller: clienteData.id_taller, // Mantener el valor original
              };

              try {
                  const actualizarResponse = await fetch(`http://localhost:3000/api/clientes/${rutCliente}`, {
                      method: 'PUT',
                      headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(clienteActualizado),
                  });

                  if (!actualizarResponse.ok) {
                      throw new Error('Error al actualizar el cliente.');
                  }

                  alert('Cliente actualizado exitosamente.');
                  modalEditarCliente.hide();
                  location.reload(); // Recargar la tabla para reflejar los cambios
              } catch (error) {
                  console.error('Error al actualizar el cliente:', error);
                  alert('Error al guardar los cambios. Por favor, intente nuevamente.');
              }
          };
      } catch (error) {
          console.error('Error al obtener la información del cliente:', error);
          alert('Error al editar el cliente. Por favor, intente nuevamente.');
      }
  }
});
